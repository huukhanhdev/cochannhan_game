"""Kiểm importer FX với alpha/key, crop và assembly thật, không tạo asset runtime."""
import json,tempfile
from pathlib import Path
from PIL import Image
from fx_import import build
with tempfile.TemporaryDirectory() as tmp:
    p=Path(tmp);im=Image.new('RGBA',(8,4),(255,0,255,255))
    im.putpixel((1,1),(0,255,0,255));im.putpixel((5,1),(255,255,255,128));im.save(p/'src.png')
    spec={'id':'fx_test','frame_size':[4,4],'pivot_px':[2,2],'rects':[[0,0,4,4],[4,0,4,4]],'durations_ms':[100,200],'key_color':'#FF00FF','loopFrames':False}
    m=build(p/'src.png',spec,p/'out');sheet=Image.open(p/'out/sheet.png')
    assert sheet.size==(8,4) and sheet.getpixel((0,0))[3]==0
    assert sheet.getpixel((1,1))==(0,255,0,255) and sheet.getpixel((5,1))==(255,255,255,128)
    assert m['status']=='review' and m['frames']==2
    # Nền Muse lệch màu key vài đơn vị vẫn bị xóa; viền ám hồng sát nền được khử, xanh lá/trắng giữ nguyên.
    im2=Image.new('RGBA',(8,4),(250,8,245,255));im2.putpixel((1,1),(0,255,0,255));im2.putpixel((2,1),(200,110,190,255))
    im2.putpixel((5,1),(255,255,255,255));im2.save(p/'noisy.png')
    build(p/'noisy.png',spec,p/'out2');s2=Image.open(p/'out2/sheet.png')
    assert s2.getpixel((0,0))[3]==0 and s2.getpixel((1,1))==(0,255,0,255) and s2.getpixel((5,1))==(255,255,255,255)
    r,g,b,al=s2.getpixel((2,1));assert al==255 and r<150 and b<150,(r,g,b)
    for change in [{'rects':[[0,0,4,4]]},{'rects':[[0,0,4,4],[7,0,4,4]]},{'pivot_px':[99,2]},{'blend':'bad'},{'loopFrames':[0,1]},{'key_tolerance':999}]:
        try:build(p/'src.png',dict(spec,**change),p/'bad')
        except ValueError:pass
        else:raise AssertionError(change)
print('FX importer: key magenta theo ngưỡng + khử ám viền, không xóa xanh/trắng, alpha/crop/timing/pivot/blend: đạt.')
