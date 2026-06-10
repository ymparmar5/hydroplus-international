export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Images"); // Replace with your Cloudinary upload preset
  formData.append("cloud_name", "hydroplus"); // Replace with your Cloudinary cloud name

  try {
    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/hydroplus/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.secure_url) {
      return data.secure_url;
    } else if (data.url) {
      return data.url;
    } else {
      throw new Error("No URL returned from Cloudinary");
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
