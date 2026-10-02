#!/usr/bin/env python3
"""Nhập dải key-pose do AI (Muse...) tạo ra thành sheet sprite cho battle.

Dùng:  python3 tools/keypose_import.py            (xử lý mọi file trong incoming_sprites/)
       python3 tools/keypose_import.py pn_cast_v1.png

Tên file: <id>_<action>_v<N>.png, id là tên ảnh trong assets/chibi_ref (vd heo_rung_attack_v1.png).
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


def clean(img):
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
    edge = keep & ndimage.binary_dilation(~keep, iterations=EDGE_PX)   # dải sát mép (ảnh gốc), không đụng phần trong
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = edge & (g > r + 25) & (g > b + 25)
    a[..., 3] = np.where(spill & (g > 150) & (r < 90) & (b < 90), 0, a[..., 3])   # viền nền xanh thuần: bỏ
    a[..., 1] = np.where(spill, np.maximum(r, b), g)
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
    m = re.match(r'([a-z0-9_]+?)_([a-z]+)_v(\d+)\.png$', path.name)
    if not m:
        print('bỏ qua (sai tên)', path.name); return None
    cid, action = PREFIX.get(m.group(1), m.group(1)), m.group(2)
    if action not in TIMING and not SIGNATURE.match(action):
        print('bỏ qua (action lạ)', path.name); return None
    FRAME, PIVOT = FRAME_BY_ID.get(cid, (globals()['FRAME'], globals()['PIVOT']))
    a = clean(Image.open(path)); p = pixel_size(a)
    fs = face_size(a, split(a, 20))
    k = (FACE / fs if fs else 1 / p) * SCALE_FIX.get(path.name, 1)
    nat = Image.fromarray(a).resize((round(a.shape[1] * k), round(a.shape[0] * k)), Image.NEAREST)
    na = np.asarray(nat).copy(); na[..., 3] = np.where(na[..., 3] > 0, 255, 0)
    found = pieces(na)
    expect = EXPECT.get(path.name) or EXPECT.get(action) or (len(TIMING[action][0]) if action in TIMING else len(found))
    if not 1 <= len(found) <= 4:
        print(f'✗ {path.name}: tách được {len(found)} pose (clip riêng cần 1–4). KHÔNG ghi đè.'); return None
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


def report():
    for mf in sorted(OUT.glob('*/manifest.json')):
        man = json.loads(mf.read_text()); W = man['frame_size'][0]; print(man['id'])
        for a, c in man['actions'].items():
            al = np.asarray(Image.open(mf.parent / c['sheet']))[..., 3] > 0; hw = []
            for i in range(c['frames']):
                ys, xs = np.nonzero(al[:, i * W:(i + 1) * W]); hw.append(f'{np.ptp(ys)}x{np.ptp(xs)}' if len(ys) else '-')
            print(f'  {a:7} cao x rộng: {"  ".join(hw)}   (scale {c["scale"]}, nguồn {c["source"]})')


def main():
    if '--report' in sys.argv: return report()
    files = [SRC / n for n in sys.argv[1:]] or sorted(SRC.glob('*.png'))
    best = {}
    for f in files:                       # giữ bản vN lớn nhất mỗi action
        m = re.search(r'_v(\d+)\.png$', f.name); k = re.sub(r'_v\d+\.png$', '', f.name)
        if m and (k not in best or int(m.group(1)) > best[k][0]): best[k] = (int(m.group(1)), f)
    for _, f in sorted(best.values(), key=lambda x: x[1].name):
        r = process(f)
        if not r: continue
        cid, action, meta = r; mf = OUT / cid / 'manifest.json'
        man = json.loads(mf.read_text()) if mf.exists() else {'id': cid, 'frame_size': list(FRAME), 'pivot_px': list(PIVOT), 'facing': 'right', 'actions': {}}
        fr, pv = FRAME_BY_ID.get(cid, (FRAME, PIVOT))
        man.update(frame_size=list(fr), pivot_px=list(pv)); man['actions'][action] = meta
        mf.write_text(json.dumps(man, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
