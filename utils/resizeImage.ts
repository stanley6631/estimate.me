import Pica from "pica";

export const resizeImage = async (
  file: File,
  maxWidth: number = 700
): Promise<File | null> => {
  const img = new window.Image();
  const pica = Pica();

  return new Promise((resolve) => {
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      const scaleFactor = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleFactor;

      const resizedCanvas = await pica.resize(img, canvas);

      resizedCanvas.toBlob(async (blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
          });

          // Log the sizes of the original and resized files
          console.log("Original File Size:", file.size, "bytes");
          console.log("Resized File Size:", optimizedFile.size, "bytes");

          resolve(optimizedFile);
        } else {
          resolve(null);
        }
      }, file.type);
    };
  });
};
