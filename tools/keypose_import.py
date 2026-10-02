#!/usr/bin/env python3
"""Nhập dải key-pose do AI (Muse...) tạo ra thành sheet sprite cho battle.

Dùng:  python3 tools/keypose_import.py                 xử lý mọi file trong incoming_sprites/
       python3 tools/keypose_import.py pn_cast_v1.png  chỉ file này
       python3 tools/keypose_import.py --report        in cao x rộng từng pose
       python3 tools/keypose_import.py --approve <id> [clip ...]   khóa bản đang dùng (sau khi người dùng duyệt)
       python3 tools/keypose_import.py --force ...     ghi đè cả clip đã khóa

Tên file: <id>_<clip>_v<N>.png (vd heo_rung_atk_v1.png, dian_lang_boss_sk_thunder_v1.png,
tran_thuy_hoa_cast_ground_v1.png). id lấy theo ảnh trong assets/chibi_ref; tên được tách bằng cách thử
mọi chỗ cắt và ưu tiên id đã biết, nên id và clip đều có thể chứa dấu gạch dưới.
Số pose kỳ vọng: clip chung theo TIMING; clip riêng (atk, sk_*, roar, cast_ground, win) theo bảng của
nhân vật trong docs/prompts/PROMPT_MUSE_ROSTER.md. Clip riêng chưa có trong bảng thì bị từ chối.
Clip đã khóa trong tools/keypose_approved.json không bị ghi đè (trừ --force).
Viết tắt pn / bnb ánh xạ qua PREFIX. --report: in chiều cao/rộng từng pose để chỉnh SCALE_FIX.
Bước: bỏ viền xanh nền → tách pose theo khoảng trống cột → đo cỡ "điểm ảnh" của
pixel art → thu về độ phân giải gốc (nearest) → đặt chân lên cùng vạch sàn → ghép sheet.
Bản mới nhất (vN lớn nhất) của mỗi action thắng. Kết quả: assets/chibi_kp/<id>/.
"""
import json, re, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SPEC_DOC = ROOT / 'docs' / 'prompts' / 'PROMPT_MUSE_ROSTER.md'
APPROVED = ROOT / 'tools' / 'keypose_approved.json'
REF = ROOT / 'assets' / 'chibi_ref'
# Nhân vật có màu xanh lá trong thiết kế (áo, tóc): không khử ám xanh ở viền
NO_DESPILL = {'phuong_chinh', 'thanh_thu', 'hoc_duong_gia_lao'}
SRC = ROOT / 'incoming_sprites'
OUT = ROOT / 'assets' / 'chibi_kp'
PREFIX = {'pn': 'phuong_nguyen', 'bnb': 'bach_ngung_bang_nam'}
FRAME = (288, 208)          # khung mặc định
PIVOT = (144, 198)          # điểm chân chạm sàn
EDGE_PX = 6                 # độ dày dải khử ám xanh quanh mép, tính theo px ảnh gốc
# Clip đặc trưng từng nhân vật: atk (đánh thường), sk_<id> (chiêu/cổ), roar, cast_ground.
# Số pose do ảnh quyết định (1–4); prompt ghi số pose cần có, sai thì gen lại.
SIGNATURE = re.compile(r'^(atk|sk_[a-z0-9_]+|roar|cast_ground)$')
SIG_TIMING = {1: ([500], 0, False), 2: ([240, 360], 1, False), 3: ([220, 120, 320], 1, False)}
# Số pose kỳ vọng khác mặc định (mặc định = số mục trong TIMING), theo tên file hoặc action
EXPECT = {}
# Khung riêng cho nhân vật to/dài: id -> ((w, h), (pivot_x, pivot_y))
FRAME_BY_ID = {'bach_ngung_bang_nam': ((352, 208), (176, 198))}
FACE = 18.5                 # cạnh khuôn mặt chuẩn (căn bậc hai diện tích da mặt, px gốc)
# Đo cỡ bằng mặt chỉ đáng tin với PN/BNB (da sáng, mặt rõ). Nhân vật khác: chuẩn hóa theo DIỆN TÍCH thân
# (trung vị các pose) so với pose idle của PN × SIZE[id]². Thú/da ngăm/râu không làm hỏng tỷ lệ.
FACE_IDS = {'phuong_nguyen', 'bach_ngung_bang_nam'}
# Cỡ hiển thị tương đối so với PN (chiều dài cạnh). Thiết kế mỹ thuật, không phải số liệu nguyên tác.
SIZE = {'heo_rung': 1.3, 'hac_hung': 1.6, 'phi_hau': 1.45, 'thach_hau': 1.45, 'ca_sau_dung_nham': 1.45,
        'ca_sau_sau_chan': 1.45, 'phi_tuong': 1.6, 'dien_lang': 1.2, 'dian_lang_boss': 1.55, 'nhat_dai_boss': 1.15,
        'thiet_ba_tu': 1.1, 'tuu_khoi_huyet_khoi': 1.3, 'hien_vien_than_ke': .85, 'ba_quy_spirit': 1.1}
# Clip có diện tích khác hẳn idle (vd chiêu kèm hiệu ứng lớn): hệ số diện tích kỳ vọng
CLIP_AREA = {'win': 1.0}
BIG = ((640, 400), (320, 390))  # khung tạm khi nhập; cuối lượt cắt về khung chung vừa đủ cho từng id
SCALE_FIX = {'pn_cast_v1.png': .93, 'pn_hit_v1.png': .8, 'pn_move_v1.png': 1.1, 'pn_guard_v1.png': .68, 'pn_ko_v1.png': .8,
             'pn_win_v1.png': .82, 'pn_attack_v1.png': .93, 'pn_heavy_v1.png': .93,
             'bnb_attack_v1.png': .93, 'bnb_ko_v1.png': .87, 'bnb_win_v1.png': .89, 'bnb_cast_v1.png': 1.05,
             'bnb_heal_v1.png': 1.08}             # chỉnh tay nếu đo mặt sai: {'pn_hit_v1.png': 1.05}
# Thời lượng mặc định (ms) và frame phát đòn; chỉnh tay trong manifest nếu cần.
TIMING = {
    'idle': ([700, 700], None, True),
    'cast': ([220, 120, 320], 1, False),
    'attack': ([200, 110, 280], 1, False),
    'heavy': ([280, 120, 320], 1, False),
    'hit': ([140, 300], None, False),
    'move': ([200, 260], None, False),
    'guard': ([160, 400], None, False),
    'heal': ([300, 500], None, False),
    'dodge': ([180, 260], None, False),
    'ko': ([200, 300, 900], None, False),
    'win': ([900], None, False),
    'warn': ([300, 600], None, False),
}


def clean(img, despill=True):
    """Tách nền. Ảnh đã có alpha thật (Muse xuất nền trong suốt) thì CHỈ dùng alpha, không lọc màu,
    để áo xanh lá / xanh rêu của nhân vật không bị xóa. Ảnh nền đặc thì chỉ xóa vùng màu nền
    nối liền với mép ảnh (flood fill), không xóa pixel cùng màu nằm trong nhân vật.
    Khử ám xanh chỉ áp dụng cho viền 1px sát vùng trong suốt và chỉ khi pixel ngả hẳn sang xanh lá."""
    a = np.asarray(img.convert('RGBA')).astype(np.int16)
    al = a[..., 3]
    if (al == 0).mean() > 0.05:
        keep = al >= 100
    else:
        rgb = a[..., :3]; bg = np.median(np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]), axis=0)
        near = np.abs(rgb - bg).sum(-1) < 60
        seed = np.zeros_like(near); seed[0] = seed[-1] = True; seed[:, 0] = seed[:, -1] = True
        L, _ = ndimage.label(near)
        bgmask = np.isin(L, np.unique(L[seed & near]))
        keep = ~bgmask
    a[..., 3] = np.where(keep, 255, 0)
    if not despill:
        return a.astype(np.uint8)
    edge = keep & ndimage.binary_dilation(~keep, iterations=EDGE_PX)   # dải sát mép (ảnh gốc), không đụng phần trong
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    chroma = edge & (g > 150) & (g > r + 60) & (g > b + 60)            # chỉ xanh lá tươi kiểu nền #00FF00
    a[..., 3] = np.where(chroma & (r < 90) & (b < 90), 0, a[..., 3])
    dark = edge & (g > r + 30) & (g > b + 30) & ((r + b) < 240)         # viền ám xanh (lẫn nền + nét tối)
    a[..., 1] = np.where(chroma | dark, np.maximum(r, b), g)
    return a.astype(np.uint8)

def pixel_size(a):
    rgb = a[..., :3].astype(int); al = a[..., 3] > 0; gaps = []
    for ax in (1, 0):
        d = np.abs(np.diff(rgb, axis=ax)).sum(-1) > 40
        d &= (al[:, 1:] & al[:, :-1]) if ax == 1 else (al[1:] & al[:-1])
        if ax == 0: d = d.T
        for row in d[::2]:
            g = np.diff(np.flatnonzero(row)); gaps += list(g[(g >= 3) & (g <= 30)])
    gaps = np.array(gaps, float); ps = np.arange(3.0, 9.0, 0.02)
    return float(ps[np.argmin([np.mean(np.abs(gaps / p - np.round(gaps / p))) for p in ps])])


def face_size(a, runs):
    """AI vẽ mỗi ảnh một cỡ người khác nhau; lấy mặt (mảng da lớn nhất mỗi pose) làm thước."""
    out = []
    for s, e in runs:
        p = a[:, s:e].astype(int); r, g, b = p[..., 0], p[..., 1], p[..., 2]
        skin = (p[..., 3] > 0) & (r > 190) & (g > 150) & (b > 130) & (r - b > 15)
        L, n = ndimage.label(skin)
        if n: out.append(np.sqrt(ndimage.sum(skin, L, range(1, n + 1)).max()))
    return min(out) if out else None


def pieces(na):
    """Tách pose theo vùng liền khối (pose chồng nhau theo cột vẫn tách được);
    mảnh nhỏ (đuôi tóc rời, đốm) gộp vào pose gần nhất."""
    al = na[..., 3] > 0
    L, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n == 0: return []
    idx = range(1, n + 1); mass = ndimage.sum(al, L, idx); total = mass.sum()
    cx = [c[1] for c in ndimage.center_of_mass(al, L, idx)]
    big = [i for i in range(n) if mass[i] > total * 0.08]
    owner = {i: (i if i in big else min(big, key=lambda b: abs(cx[b] - cx[i]))) for i in range(n)}
    out = []
    for b in sorted(big, key=lambda b: cx[b]):
        m = np.isin(L, [i + 1 for i in range(n) if owner[i] == b])
        p = na.copy(); p[~m] = 0; out.append(p)
    return out


def split(a, min_gap=4):
    cols = (a[..., 3] > 0).sum(0); total = cols.sum(); runs = []; x = 0; W = len(cols)
    while x < W:
        if cols[x] == 0: x += 1; continue
        s = x; empty = 0
        while x < W and empty < min_gap:
            empty = empty + 1 if cols[x] == 0 else 0; x += 1
        e = x - empty
        if cols[s:e].sum() > total * 0.03: runs.append((s, e))
    return runs


class ClipError(Exception):
    pass


def to_frame(piece, FRAME=FRAME, PIVOT=PIVOT):
    al = piece[..., 3] > 0; ys, xs = np.nonzero(al)
    piece = piece[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    al = piece[..., 3] > 0; h, w = al.shape
    foot = np.nonzero(al[max(0, h - 4):].any(0))[0]        # cột có chân ở 4 hàng cuối
    fx = w // 2 if w > 1.6 * h else int(round((foot.min() + foot.max()) / 2))   # tư thế nằm: căn giữa thân
    canvas = Image.new('RGBA', FRAME, (0, 0, 0, 0))
    ox, oy = PIVOT[0] - fx, PIVOT[1] - h
    if ox < 0 or oy < 0 or ox + w > FRAME[0]:
        raise ClipError(f'pose {w}x{h} tràn khung {FRAME}: thêm/tăng FRAME_BY_ID cho actor này')
    canvas.alpha_composite(Image.fromarray(piece), (max(ox, 0), max(oy, 0)), (max(-ox, 0), max(-oy, 0)))
    return canvas


def process(path):
    pr = parse_name(path.name)
    if not pr:
        print('✗ bỏ qua (tên không đúng <id>_<clip>_vN.png hoặc clip lạ):', path.name); return None
    cid, action, _ = pr
    if action == 'base':
        return save_base(path, cid)
    spec = load_spec().get(cid, {})
    if action not in TIMING and action not in spec:
        print(f'✗ {path.name}: clip riêng "{action}" chưa có trong bảng {cid} của PROMPT_MUSE_ROSTER.md'); return None
    FRAME, PIVOT = FRAME_BY_ID.get(cid, (globals()['FRAME'], globals()['PIVOT']) if cid in FACE_IDS else BIG)
    a = clean(Image.open(path), despill=cid not in NO_DESPILL); p = pixel_size(a)
    if cid in FACE_IDS:
        fs = face_size(a, split(a, 20))
        k = (FACE / fs if fs else 1 / p) * SCALE_FIX.get(path.name, 1)
    else:
        fs = None; raw = pieces(a)
        if not raw: print(f'✗ {path.name}: ảnh trống'); return None
        area = float(np.median([(r[..., 3] > 0).sum() for r in raw]))
        k = np.sqrt(ref_area() * SIZE.get(cid, 1) ** 2 * CLIP_AREA.get(action, 1) / area) * SCALE_FIX.get(path.name, 1)
    nat = Image.fromarray(a).resize((round(a.shape[1] * k), round(a.shape[0] * k)), Image.NEAREST)
    na = np.asarray(nat).copy(); na[..., 3] = np.where(na[..., 3] > 0, 255, 0)
    found = pieces(na)
    expect = EXPECT.get(path.name) or spec.get(action) or (len(TIMING[action][0]) if action in TIMING else None)
    if expect is None:
        print(f'✗ {path.name}: không biết số pose kỳ vọng của "{action}". Thêm vào bảng nhân vật hoặc EXPECT.'); return None
    if not 1 <= len(found) <= 4:
        print(f'✗ {path.name}: tách được {len(found)} pose (clip riêng cần 1–4). KHÔNG ghi đè.'); return None
    if action == 'idle' and expect == 2 and len(found) == 1:
        found = found * 2                 # Muse hay vẽ idle 1 pose: dùng 2 frame giống nhau, nhịp thở do code
        print(f'  {path.name}: idle chỉ 1 pose → nhân đôi frame')
    if len(found) != expect:
        print(f'✗ {path.name}: tách được {len(found)} pose, cần {expect}. KHÔNG ghi đè sheet cũ. '
              f'(Pose dính nhau / thừa người → gen lại; cố ý khác số pose → thêm vào EXPECT)'); return None
    try:
        frames = [to_frame(piece, FRAME, PIVOT) for piece in found]
    except ClipError as e:
        print(f'✗ {path.name}: {e}. KHÔNG ghi đè sheet cũ.'); return None
    d = OUT / cid; d.mkdir(parents=True, exist_ok=True)
    sheet = Image.new('RGBA', (FRAME[0] * len(frames), FRAME[1]), (0, 0, 0, 0))
    for i, f in enumerate(frames): sheet.alpha_composite(f, (i * FRAME[0], 0))
    sheet.save(d / f'{action}.png', optimize=True)
    dur, rel, loop = TIMING.get(action) or SIG_TIMING[min(len(frames), 3)]
    if len(dur) != len(frames): dur = (dur + [dur[-1]] * len(frames))[:len(frames)]
    meta_hand = None
    if rel is not None and rel < len(frames):         # điểm xa nhất phía trước ở frame phát đòn = bàn tay
        al = np.asarray(frames[rel])[..., 3] > 0; xs = np.nonzero(al.any(0))[0]; x = int(xs.max())
        meta_hand = [x, int(np.nonzero(al[:, x])[0].mean())]
    print(f'{path.name}: điểm ảnh {p:.2f}px, mặt {fs or 0:.0f}px, tỷ lệ {k:.3f} → {len(frames)} pose, gốc {nat.size[0]}x{nat.size[1]}')
    return cid, action, {'sheet': f'{action}.png', 'frames': len(frames), 'durations_ms': dur,
                         'loop': loop, 'release': rel, 'source': path.name, 'scale': round(k, 4), **({'hand': meta_hand} if meta_hand else {})}


_REF_AREA = None
def ref_area():
    """Diện tích trung bình (px gốc) một frame idle của PN đã duyệt: thước chung cho mọi nhân vật."""
    global _REF_AREA
    if _REF_AREA is None:
        m = json.loads((OUT / 'phuong_nguyen' / 'manifest.json').read_text()); W = m['frame_size'][0]
        al = np.asarray(Image.open(OUT / 'phuong_nguyen' / 'idle.png'))[..., 3] > 0
        _REF_AREA = float(np.mean([al[:, i * W:(i + 1) * W].sum() for i in range(m['actions']['idle']['frames'])]))
    return _REF_AREA


def fit_frames(cid, pad=8):
    """Cắt mọi sheet của id về một khung chung vừa đủ, đối xứng quanh pivot (lật trái/phải không lệch)."""
    d = OUT / cid; mf = d / 'manifest.json'; man = json.loads(mf.read_text())
    (W, H), (px, py) = man['frame_size'], man['pivot_px']; reach, top, bot = 0, 0, 0
    for c in man['actions'].values():
        al = np.asarray(Image.open(d / c['sheet']))[..., 3] > 0
        for i in range(c['frames']):
            ys, xs = np.nonzero(al[:, i * W:(i + 1) * W])
            if len(xs): reach = max(reach, px - xs.min(), xs.max() + 1 - px); top = max(top, py - ys.min()); bot = max(bot, ys.max() + 1 - py)
    reach, top, bot = int(reach), int(top), int(bot)
    nw = max(288, 2 * (reach + pad)); nh = max(208, top + pad + max(10, bot + 2)); npx, npy = nw // 2, nh - max(10, bot + 2)
    for c in man['actions'].values():
        sh = Image.open(d / c['sheet']); out = Image.new('RGBA', (nw * c['frames'], nh), (0, 0, 0, 0))
        for i in range(c['frames']):
            out.alpha_composite(sh.crop((i * W + px - npx, py - npy, i * W + px - npx + nw, py - npy + nh)), (i * nw, 0))
        out.save(d / c['sheet'], optimize=True)
        if c.get('hand'): c['hand'] = [c['hand'][0] - px + npx, c['hand'][1] - py + npy]
    man.update(frame_size=[nw, nh], pivot_px=[npx, npy], reach_px=reach); mf.write_text(json.dumps(man, ensure_ascii=False, indent=1))
    print(f'  {cid}: khung chung {nw}x{nh}, pivot {npx},{npy}')


def pad_to(cid, man, fr, pv):
    """Đưa các sheet đã cắt gọn của id về khung tạm (fr, pv) để ghép thêm clip mới cùng khung."""
    d = OUT / cid; (W, H), (px, py) = man['frame_size'], man['pivot_px']
    for a, c in man['actions'].items():
        sh = Image.open(d / c['sheet']); out = Image.new('RGBA', (fr[0] * c['frames'], fr[1]), (0, 0, 0, 0))
        for i in range(c['frames']):
            out.alpha_composite(sh.crop((i * W, 0, (i + 1) * W, H)), (i * fr[0] + pv[0] - px, pv[1] - py))
        out.save(d / c['sheet'], optimize=True)
        if c.get('hand'): c['hand'] = [c['hand'][0] - px + pv[0], c['hand'][1] - py + pv[1]]


def save_base(path, cid):
    """Ảnh gốc side view mới (<id>_base_vN.png): tách nền, cắt sát, lưu thành assets/chibi_ref/<id>.png.
    Bản cũ được giữ ở assets/chibi_ref/_cu/<id>.png (lần đầu). Không tạo sheet hay manifest."""
    a = clean(Image.open(path), despill=cid not in NO_DESPILL)
    found = pieces(a)
    if len(found) != 1:
        print(f'✗ {path.name}: ảnh gốc phải có đúng 1 nhân vật, tách được {len(found)}. KHÔNG ghi đè.'); return None
    al = found[0][..., 3] > 0; ys, xs = np.nonzero(al)
    img = Image.fromarray(found[0][max(0, ys.min() - 8):ys.max() + 9, max(0, xs.min() - 8):xs.max() + 9])
    dst = REF / f'{cid}.png'
    if dst.exists():
        old = REF / '_cu' / f'{cid}.png'; old.parent.mkdir(exist_ok=True)
        if not old.exists(): dst.replace(old)
    img.save(dst, optimize=True)
    print(f'{path.name}: ảnh gốc mới → assets/chibi_ref/{cid}.png ({img.width}x{img.height})')
    return None


def known_ids():
    ids = set(PREFIX) | {p.stem for p in REF.glob('*.png') if not p.stem.endswith('_full')}
    ids |= {p.name for p in OUT.glob('*') if p.is_dir()} | set(load_spec())
    return ids


def is_clip(c):
    return c in TIMING or c == 'base' or bool(SIGNATURE.match(c))


def parse_name(name):
    """<id>_<clip>_v<N>.png → (id, clip, N). Thử mọi chỗ cắt; ưu tiên id đã biết, rồi id ngắn nhất."""
    m = re.match(r'^([a-z0-9_]+)_v(\d+)\.png$', name)
    if not m: return None
    stem, ver = m.group(1), int(m.group(2)); known = known_ids()
    cands = [(stem[:i], stem[i + 1:]) for i, ch in enumerate(stem) if ch == '_' and is_clip(stem[i + 1:])]
    if not cands: return None
    good = [c for c in cands if c[0] in known]
    cid, clip = (good or cands)[0]
    return PREFIX.get(cid, cid), clip, ver


_SPEC = None
def load_spec():
    """Đọc số pose của clip riêng từ bảng từng nhân vật trong PROMPT_MUSE_ROSTER.md.
    Mục bắt đầu bằng dòng '#### ... `id`'; bảng có cột 'Pose'. Nhân vật dòng 'Animal:' dùng ko 2 pose."""
    global _SPEC
    if _SPEC is not None: return _SPEC
    _SPEC = {}
    if not SPEC_DOC.exists(): return _SPEC
    cid, col = None, None
    for line in SPEC_DOC.read_text().splitlines():
        h = re.match(r'^####\s.*?`([a-z0-9_]+)`', line)
        if h: cid, col = h.group(1), None; _SPEC.setdefault(cid, {}); continue
        if not cid: continue
        if '`Animal:' in line: _SPEC[cid].setdefault('ko', 2)
        if line.startswith('|'):
            cells = [c.strip().strip('`') for c in line.strip().strip('|').split('|')]
            if 'Pose' in cells: col = cells.index('Pose'); continue
            if col is not None and len(cells) > col and re.fullmatch(r'\d', cells[col]) and is_clip(cells[0]):
                _SPEC[cid][cells[0]] = int(cells[col])
    return _SPEC


def load_approved():
    return json.loads(APPROVED.read_text()) if APPROVED.exists() else {}


def approve(cid, clips):
    cid = PREFIX.get(cid, cid); mf = OUT / cid / 'manifest.json'
    if not mf.exists(): print('chưa có sheet cho', cid); return
    man = json.loads(mf.read_text()); ap = load_approved(); ap.setdefault(cid, {})
    for a, c in man['actions'].items():
        if not clips or a in clips: ap[cid][a] = c['source']; print(f'khóa {cid}/{a} = {c["source"]}')
    APPROVED.write_text(json.dumps(ap, ensure_ascii=False, indent=1))


def report():
    for mf in sorted(OUT.glob('*/manifest.json')):
        man = json.loads(mf.read_text()); W = man['frame_size'][0]; print(man['id'])
        for a, c in man['actions'].items():
            al = np.asarray(Image.open(mf.parent / c['sheet']))[..., 3] > 0; hw = []
            for i in range(c['frames']):
                ys, xs = np.nonzero(al[:, i * W:(i + 1) * W]); hw.append(f'{np.ptp(ys)}x{np.ptp(xs)}' if len(ys) else '-')
            print(f'  {a:7} cao x rộng: {"  ".join(hw)}   (scale {c["scale"]}, nguồn {c["source"]})')


def main():
    args = sys.argv[1:]
    if '--report' in args: return report()
    if args[:1] == ['--approve']:
        if len(args) < 2: print('dùng: --approve <id> [clip ...]'); return
        return approve(args[1], args[2:])
    force = '--force' in args; names = [a for a in args if not a.startswith('--')]
    files = [SRC / n for n in names] or sorted(SRC.glob('*.png'))
    approved = load_approved(); touched = set()
    best = {}
    for f in files:                       # giữ bản vN lớn nhất mỗi action
        m = re.search(r'_v(\d+)\.png$', f.name); k = re.sub(r'_v\d+\.png$', '', f.name)
        if m and (k not in best or int(m.group(1)) > best[k][0]): best[k] = (int(m.group(1)), f)
    for _, f in sorted(best.values(), key=lambda x: x[1].name):
        pr = parse_name(f.name)
        if pr and not force and pr[1] in approved.get(pr[0], {}):
            src = approved[pr[0]][pr[1]]
            if src != f.name: print(f'⏸ {f.name}: {pr[0]}/{pr[1]} đã khóa bản duyệt {src}; xem rồi chạy với --force hoặc --approve')
            continue
        r = process(f)
        if not r: continue
        cid, action, meta = r; mf = OUT / cid / 'manifest.json'
        man = json.loads(mf.read_text()) if mf.exists() else {'id': cid, 'frame_size': list(FRAME), 'pivot_px': list(PIVOT), 'facing': 'right', 'actions': {}}
        fr, pv = FRAME_BY_ID.get(cid, (FRAME, PIVOT) if cid in FACE_IDS else BIG)
        if man['frame_size'] != list(fr):     # sheet cũ đã cắt gọn: đưa về khung tạm trước khi thêm clip mới
            pad_to(cid, man, fr, pv)
        man.update(frame_size=list(fr), pivot_px=list(pv)); man['actions'][action] = meta
        mf.write_text(json.dumps(man, ensure_ascii=False, indent=1)); touched.add(cid)
    for cid in sorted(touched - FACE_IDS - set(FRAME_BY_ID)): fit_frames(cid)


if __name__ == '__main__':
    main()
