// import React, { useState } from "react";
// import { db } from "../../firebase";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import toast from "react-hot-toast";

// const AddProduct = () => {
//   const [product, setProduct] = useState({
//     id: "",
//     name: "",
//     slug: "",
//     category: "",
//     subcategory: "",
//     brand: "",
//     description: "",
//     shortDescription: "",
//     mrp: "",
//     salePrice: "",
//     costPrice: "",
//     discount: "",
//     tax: "",
//     weight: "",
//     dimensions: "",
//     warranty: "",
//     returnPolicy: "",
//     thumbnail: "",
//     tags: "",
//     isFeatured: false,
//     isActive: true,
//   });

//   const [vehicles, setVehicles] = useState([
//     { make: "", model: "", year: "", engine: "" },
//   ]);

//   const [variants, setVariants] = useState([
//     { sku: "", position: "", material: "", stock: "" },
//   ]);

//   const [images, setImages] = useState([""]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct({
//       ...product,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Vehicle handlers
//   const handleVehicleChange = (index, e) => {
//     const newVehicles = [...vehicles];
//     newVehicles[index][e.target.name] = e.target.value;
//     setVehicles(newVehicles);
//   };

//   const addVehicle = () =>
//     setVehicles([...vehicles, { make: "", model: "", year: "", engine: "" }]);

//   // Variant handlers
//   const handleVariantChange = (index, e) => {
//     const newVariants = [...variants];
//     newVariants[index][e.target.name] = e.target.value;
//     setVariants(newVariants);
//   };

//   const addVariant = () =>
//     setVariants([...variants, { sku: "", position: "", material: "", stock: "" }]);

// const handleImageUpload = async (index, file) => {
//   if (!file) return;

//   try {
//     const options = {
//       maxSizeMB: 0.2, // 🔥 200KB max
//       maxWidthOrHeight: 800,
//       useWebWorker: true,
//     };

//     // compress image
//     const compressedFile = await imageCompression(file, options);

//     // convert to base64
//     const reader = new FileReader();
//     reader.readAsDataURL(compressedFile);

//     reader.onloadend = () => {
//       const newImages = [...images];
//       newImages[index] = reader.result;
//       setImages(newImages);
//     };
//   } catch (error) {
//     console.error("Image compression error:", error);
//   }
// };

// const addImage = () => setImages([...images, ""]);


//   // 🔥 Submit to Firestore
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const totalStock = variants.reduce(
//       (sum, v) => sum + Number(v.stock || 0),
//       0
//     );

//     const productData = {
//       ...product,
//       mrp: Number(product.mrp),
//       salePrice: Number(product.salePrice),
//       costPrice: Number(product.costPrice),
//       discount: Number(product.discount),
//       tax: Number(product.tax),
//       vehicleCompatibility: vehicles,
//       variants: variants.map((v) => ({
//         ...v,
//         stock: Number(v.stock),
//       })),
//       images: images.filter((img) => img !== ""),
//       tags: product.tags.split(","),
//       totalStock,
//       ratings: { average: 0, count: 0 },
//       seo: {
//         title: product.name,
//         description: product.shortDescription,
//         keywords: product.tags.split(","),
//       },
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     };

//     try {
//       await addDoc(collection(db, "products"), productData);
//       toast.success("✅ Product Added Successfully");
//     } catch (error) {
//       console.error(error);
//       toast.error("❌ Error adding product");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-6 max-w-6xl mx-auto space-y-6"
//     >
//       <h2 className="text-2xl font-bold">Add Car Spare Product</h2>

//       {/* BASIC DETAILS */}
//       <div className="grid grid-cols-2 gap-4">
//         <input name="id" placeholder="Product ID" onChange={handleChange} className="input" />
//         <input name="name" placeholder="Product Name" onChange={handleChange} className="input" />
//         <input name="slug" placeholder="Slug" onChange={handleChange} className="input" />
//         <input name="brand" placeholder="Brand" onChange={handleChange} className="input" />
//         <input name="category" placeholder="Category" onChange={handleChange} className="input" />
//         <input name="subcategory" placeholder="Subcategory" onChange={handleChange} className="input" />
//       </div>

//       <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />
//       <textarea name="shortDescription" placeholder="Short Description" onChange={handleChange} className="input" />

//       {/* PRICE */}
//       <div className="grid grid-cols-4 gap-4">
//         <input name="mrp" placeholder="MRP" onChange={handleChange} className="input" />
//         <input name="salePrice" placeholder="Sale Price" onChange={handleChange} className="input" />
//         <input name="costPrice" placeholder="Cost Price" onChange={handleChange} className="input" />
//         <input name="discount" placeholder="Discount %" onChange={handleChange} className="input" />
//         <input name="tax" placeholder="Tax %" onChange={handleChange} className="input" />
//       </div>

//       {/* VEHICLE COMPATIBILITY */}
//       <div>
//         <h3 className="font-semibold">Vehicle Compatibility</h3>
//         {vehicles.map((v, i) => (
//           <div key={i} className="grid grid-cols-4 gap-2 mb-2">
//             <input name="make" placeholder="Make" onChange={(e) => handleVehicleChange(i, e)} className="input" />
//             <input name="model" placeholder="Model" onChange={(e) => handleVehicleChange(i, e)} className="input" />
//             <input name="year" placeholder="Year" onChange={(e) => handleVehicleChange(i, e)} className="input" />
//             <input name="engine" placeholder="Engine" onChange={(e) => handleVehicleChange(i, e)} className="input" />
//           </div>
//         ))}
//         <button type="button" onClick={addVehicle} className="btn">+ Add Vehicle</button>
//       </div>

//       {/* VARIANTS */}
//       <div>
//         <h3 className="font-semibold">Variants</h3>
//         {variants.map((v, i) => (
//           <div key={i} className="grid grid-cols-4 gap-2 mb-2">
//             <input name="sku" placeholder="SKU" onChange={(e) => handleVariantChange(i, e)} className="input" />
//             <input name="position" placeholder="Position" onChange={(e) => handleVariantChange(i, e)} className="input" />
//             <input name="material" placeholder="Material" onChange={(e) => handleVariantChange(i, e)} className="input" />
//             <input name="stock" placeholder="Stock" onChange={(e) => handleVariantChange(i, e)} className="input" />
//           </div>
//         ))}
//         <button type="button" onClick={addVariant} className="btn">+ Add Variant</button>
//       </div>

//       {/* IMAGES */}
//      <div className="bg-white shadow rounded-xl p-6">
//   <h3 className="text-xl font-semibold mb-4">Images</h3>

//   {images.map((img, i) => (
//     <div key={i} className="mb-4">
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => handleImageUpload(i, e.target.files[0])}
//         className="block w-full text-sm text-gray-500
//         file:mr-4 file:py-2 file:px-4
//         file:rounded-lg file:border-0
//         file:text-sm file:font-semibold
//         file:bg-black file:text-white
//         hover:file:bg-gray-800"
//       />

//       {img && (
//         <img
//           src={img}
//           alt="preview"
//           className="mt-3 w-32 h-32 object-cover rounded-lg border"
//         />
//       )}
//     </div>
//   ))}

//   <button type="button" onClick={addImage} className="btn">
//     + Add Image
//   </button>
// </div>

//       {/* EXTRA */}
//       <div className="grid grid-cols-2 gap-4">
//         <input name="thumbnail" placeholder="Thumbnail URL" onChange={handleChange} className="input" />
//         <input name="weight" placeholder="Weight" onChange={handleChange} className="input" />
//         <input name="dimensions" placeholder="Dimensions" onChange={handleChange} className="input" />
//         <input name="warranty" placeholder="Warranty" onChange={handleChange} className="input" />
//         <input name="returnPolicy" placeholder="Return Policy" onChange={handleChange} className="input" />
//         <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} className="input" />
//       </div>

//       {/* CHECKBOX */}
//       <div className="flex gap-6">
//         <label>
//           <input type="checkbox" name="isFeatured" onChange={handleChange} /> Featured
//         </label>
//         <label>
//           <input type="checkbox" name="isActive" defaultChecked onChange={handleChange} /> Active
//         </label>
//       </div>

//       <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg">
//         Save Product
//       </button>
//     </form>
//   );
// };

// export default AddProduct;


import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const AddProduct = () => {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    slug: "",
    category: "",
    subcategory: "",
    brand: "",
    description: "",
    shortDescription: "",
    mrp: "",
    salePrice: "",
    costPrice: "",
    discount: "",
    tax: "",
    weight: "",
    dimensions: "",
    warranty: "",
    returnPolicy: "",
    tags: "",
    isFeatured: false,
    isActive: true,
  });

  const [vehicles, setVehicles] = useState([
    { make: "", model: "", year: "", engine: "" },
  ]);

  const [variants, setVariants] = useState([
    { sku: "", position: "", material: "", stock: "" },
  ]);

  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  // 🔹 Vehicle handlers
  const handleVehicleChange = (index, e) => {
    const newVehicles = [...vehicles];
    newVehicles[index][e.target.name] = e.target.value;
    setVehicles(newVehicles);
  };

  const addVehicle = () =>
    setVehicles([...vehicles, { make: "", model: "", year: "", engine: "" }]);

  // 🔹 Variant handlers
  const handleVariantChange = (index, e) => {
    const newVariants = [...variants];
    newVariants[index][e.target.name] = e.target.value;
    setVariants(newVariants);
  };

  const addVariant = () =>
    setVariants([...variants, { sku: "", position: "", material: "", stock: "" }]);

  // 🔹 Convert to base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // 🔹 Multiple image upload with compression
  const handleMultipleImages = async (files) => {
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const base64 = await convertToBase64(compressedFile);
        imageArray.push(base64);
      } catch (error) {
        console.error("Compression error:", error);
      }
    }

    const updatedImages = [...images, ...imageArray];
    setImages(updatedImages);

    if (!thumbnail && updatedImages.length > 0) {
      setThumbnail(updatedImages[0]);
    }
  };

  // 🔹 Remove image
  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);

    if (index === 0 && updated.length > 0) {
      setThumbnail(updated[0]);
    }
  };

  // 🔥 Submit to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalStock = variants.reduce(
      (sum, v) => sum + Number(v.stock || 0),
      0
    );

    const productData = {
      ...product,
      mrp: Number(product.mrp),
      salePrice: Number(product.salePrice),
      costPrice: Number(product.costPrice),
      discount: Number(product.discount),
      tax: Number(product.tax),
      vehicleCompatibility: vehicles,
      variants: variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
      })),
      images,
      thumbnail,
      tags: product.tags.split(",").map((t) => t.trim()),
      totalStock,
      ratings: { average: 0, count: 0 },
      seo: {
        title: product.name,
        description: product.shortDescription,
        keywords: product.tags.split(","),
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "products"), productData);
      toast.success("✅ Product Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error adding product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Add Car Spare Product</h2>

      {/* BASIC DETAILS */}
      <div className="grid grid-cols-2 gap-4">
        <input name="id" placeholder="Product ID" onChange={handleChange} className="input" />
        <input name="name" placeholder="Product Name" onChange={handleChange} className="input" />
        <input name="slug" placeholder="Slug" onChange={handleChange} className="input" />
        <input name="brand" placeholder="Brand" onChange={handleChange} className="input" />
        <input name="category" placeholder="Category" onChange={handleChange} className="input" />
        <input name="subcategory" placeholder="Subcategory" onChange={handleChange} className="input" />
      </div>

      <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />
      <textarea name="shortDescription" placeholder="Short Description" onChange={handleChange} className="input" />

      {/* PRICE */}
      <div className="grid grid-cols-5 gap-4">
        <input name="mrp" placeholder="MRP" onChange={handleChange} className="input" />
        <input name="salePrice" placeholder="Sale Price" onChange={handleChange} className="input" />
        <input name="costPrice" placeholder="Cost Price" onChange={handleChange} className="input" />
        <input name="discount" placeholder="Discount %" onChange={handleChange} className="input" />
        <input name="tax" placeholder="Tax %" onChange={handleChange} className="input" />
      </div>

      {/* VEHICLES */}
      <div>
        <h3 className="font-semibold">Vehicle Compatibility</h3>
        {vehicles.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <input name="make" placeholder="Make" onChange={(e) => handleVehicleChange(i, e)} className="input" />
            <input name="model" placeholder="Model" onChange={(e) => handleVehicleChange(i, e)} className="input" />
            <input name="year" placeholder="Year" onChange={(e) => handleVehicleChange(i, e)} className="input" />
            <input name="engine" placeholder="Engine" onChange={(e) => handleVehicleChange(i, e)} className="input" />
          </div>
        ))}
        <button type="button" onClick={addVehicle} className="btn">+ Add Vehicle</button>
      </div>

      {/* VARIANTS */}
      <div>
        <h3 className="font-semibold">Variants</h3>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <input name="sku" placeholder="SKU" onChange={(e) => handleVariantChange(i, e)} className="input" />
            <input name="position" placeholder="Position" onChange={(e) => handleVariantChange(i, e)} className="input" />
            <input name="material" placeholder="Material" onChange={(e) => handleVariantChange(i, e)} className="input" />
            <input name="stock" placeholder="Stock" onChange={(e) => handleVariantChange(i, e)} className="input" />
          </div>
        ))}
        <button type="button" onClick={addVariant} className="btn">+ Add Variant</button>
      </div>

      {/* MULTIPLE IMAGE UPLOAD */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Product Images</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleMultipleImages(e.target.files)}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-black file:text-white
          hover:file:bg-gray-800"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt="product"
                className="w-full h-32 object-cover rounded-lg border"
              />

              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs"
              >
                ✕
              </button>

              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Thumbnail
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* EXTRA */}
      <div className="grid grid-cols-2 gap-4">
        <input name="weight" placeholder="Weight" onChange={handleChange} className="input" />
        <input name="dimensions" placeholder="Dimensions" onChange={handleChange} className="input" />
        <input name="warranty" placeholder="Warranty" onChange={handleChange} className="input" />
        <input name="returnPolicy" placeholder="Return Policy" onChange={handleChange} className="input" />
        <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} className="input" />
      </div>

      {/* CHECKBOX */}
      <div className="flex gap-6">
        <label><input type="checkbox" name="isFeatured" onChange={handleChange} /> Featured</label>
        <label><input type="checkbox" name="isActive" defaultChecked onChange={handleChange} /> Active</label>
      </div>

      <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg">
        Save Product
      </button>
    </form>
  );
};

export default AddProduct;
