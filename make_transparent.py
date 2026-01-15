from PIL import Image
import os

def make_transparent(folder_path):
    print(f"Processing images in {folder_path}...")
    
    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} does not exist.")
        return

    count = 0
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.png') or filename.lower().endswith('.jpg'):
            file_path = os.path.join(folder_path, filename)
            try:
                img = Image.open(file_path)
                img = img.convert("RGBA")
                
                datas = img.getdata()
                
                new_data = []
                # Threshold for "White". 
                # Since user said "White", we act on (255, 255, 255).
                # To be safe, let's include very bright pixels? No, user said "it is white", implying a flat background.
                # Let's stick to strict white first to avoid eating into highlights.
                
                for item in datas:
                    # item is (R, G, B, A)
                    if item[0] >= 250 and item[1] >= 250 and item[2] >= 250:
                        new_data.append((255, 255, 255, 0))
                    else:
                        new_data.append(item)
                        
                img.putdata(new_data)
                img.save(file_path, "PNG")
                print(f"Processed: {filename}")
                count += 1
            except Exception as e:
                print(f"Failed to process {filename}: {e}")
                
    print(f"Done. Processed {count} images.")

if __name__ == "__main__":
    target_dir = os.path.join(os.getcwd(), 'public', 'images', 'characters')
    make_transparent(target_dir)
