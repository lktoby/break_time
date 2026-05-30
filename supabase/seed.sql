-- stickers seed（合体なし。全件 rarity = 'normal'）
insert into public.stickers (slug, name, image_path, rarity)
values
  ('apple',  'りんご',       '/stickers/apple.png',  'normal'),
  ('bear',   'くま',         '/stickers/bear.png',   'normal'),
  ('boy',    'おとこのこ',   '/stickers/boy.png',    'normal'),
  ('cat1',   'ねこ',         '/stickers/cat1.png',   'normal'),
  ('cat2',   'ねこ2',        '/stickers/cat2.png',   'normal'),
  ('cat3',   'ねこ3',        '/stickers/cat3.png',   'normal'),
  ('cherry', 'さくらんぼ',   '/stickers/cherry.png', 'normal'),
  ('cosmos', 'コスモス',     '/stickers/cosmos.png', 'normal'),
  ('dog1',   'いぬ',         '/stickers/dog1.png',   'normal'),
  ('dog2',   'いぬ2',        '/stickers/dog2.png',   'normal'),
  ('dog3',   'いぬ3',        '/stickers/dog3.png',   'normal'),
  ('girl',   'おんなのこ',   '/stickers/girl.png',   'normal'),
  ('okashi', 'おかし',       '/stickers/okashi.png', 'normal'),
  ('pengin', 'ペンギン',     '/stickers/pengin.png', 'normal'),
  ('sakura', 'さくら',       '/stickers/sakura.png', 'normal'),
  ('sea',    'うみ',         '/stickers/sea.png',    'normal'),
  ('star',   'ほし',         '/stickers/star.png',   'normal'),
  ('sumire', 'すみれ',       '/stickers/sumire.png', 'normal')
on conflict (slug) do update set
  name       = excluded.name,
  image_path = excluded.image_path,
  rarity     = excluded.rarity;
