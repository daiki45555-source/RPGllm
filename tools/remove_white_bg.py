from PIL import Image
import os

# エネミーフォルダのパス
enemy_folder = r"C:\Users\daiki\Desktop\RPGllm\エネミー"
output_folder = r"C:\Users\daiki\Desktop\RPGllm\エネミー\透過済み"

# 出力フォルダ作成
os.makedirs(output_folder, exist_ok=True)

# 白色のしきい値（RGBがこれ以上なら白とみなす）
WHITE_THRESHOLD = 240

def remove_white_background(input_path, output_path):
    """白い背景を透過にする"""
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        # RGB値がすべてしきい値以上なら透過
        if item[0] >= WHITE_THRESHOLD and item[1] >= WHITE_THRESHOLD and item[2] >= WHITE_THRESHOLD:
            new_data.append((255, 255, 255, 0))  # 完全透過
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"透過完了: {os.path.basename(output_path)}")

# 処理対象のファイル
files = ["ゴブリン.png", "ポイズンラット.png", "暴漢1.png", "暴漢2.png"]

for filename in files:
    input_path = os.path.join(enemy_folder, filename)
    output_path = os.path.join(output_folder, filename)
    
    if os.path.exists(input_path):
        remove_white_background(input_path, output_path)
    else:
        print(f"ファイルが見つかりません: {filename}")

print("\n全ての処理が完了しました！")
print(f"透過済み画像は {output_folder} に保存されています。")
