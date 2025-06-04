// import React, { useEffect, useRef, useState } from 'react'
// import { useGet } from '../../../../Hooks/useGet';
// import { DropDown, LoaderLogin, NumberInput, StaticButton, SubmitButton, Switch, TextInput, TimeInput, TitlePage, UploadInput } from '../../../../Components/Components';
// import { usePost } from '../../../../Hooks/usePostJson';
// import { MultiSelect } from 'primereact/multiselect';
// import ButtonAdd from '../../../../Components/Buttons/AddButton';
// import { useAuth } from '../../../../Context/Auth';

// const AddProductPage = () => {
//   const auth = useAuth();
//   /* Get Data */
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const { refetch: refetchTranslation, loading: loadingTranslation, data: dataTranslation } = useGet({
//     url: `${apiUrl}/admin/translation`
//   });
//   const { refetch: refetchCategory, loading: loadingCategory, data: dataCategory } = useGet({ url: `${apiUrl}/admin/category` });
//   const { refetch: refetchProduct, loading: loadingProduct, data: dataProduct } = useGet({
//     url: `${apiUrl}/admin/product`
//   });
//   const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/product/add` });
//   /* Refs */
//   const variationTypeRef = useRef([]);
//   const [openVariationIndex, setOpenVariationIndex] = useState(null); // Tracks which variation's dropdown is open


//   const categoryRef = useRef();
//   const subCategoryRef = useRef();
//   const itemTypeRef = useRef();
//   const stockTypeRef = useRef();
//   const discountRef = useRef();
//   const taxRef = useRef();
//   const productImageRef = useRef();
//   /* States */
//   const [taps, setTaps] = useState([])
//   const [currentProductNamesTap, setCurrentProductNamesTap] = useState(0);
//   const [currentExcludeNamesTap, setCurrentExcludeNamesTap] = useState(0);
//   const [currentExtraNamesTap, setCurrentExtraNamesTap] = useState(0);
//   const [currentVariationTap, setCurrentVariationTap] = useState(0);
//   const [currentVariationOptionTap, setCurrentVariationOptionTap] = useState(0);

//   const [categories, setCategories] = useState([])
//   const [subCategories, setSubCategories] = useState([])
//   const [filterSubCategories, setFilterSubCategories] = useState([])
//   const [addons, setAddons] = useState([])
//   const [discounts, setDiscounts] = useState([])
//   const [taxes, setTaxes] = useState([])

//   const [itemTypes, setItemTypes] = useState([{ id: '', name: 'Selected Item Type' }, , { id: 'online', name: 'online' }, { id: 'offline', name: 'offline' }, { id: 'all', name: 'all' }])
//   const [stockTypes, setStockTypes] = useState([{ id: '', name: 'Selected Stock Type' }, , { id: 'unlimited', name: 'unlimited' }, { id: 'daily', name: 'daily' }, { id: 'fixed', name: 'fixed' }])

//   // Selected Data 
//   // Product Names
//   const [productNames, setProductNames] = useState([]);

//   // Product Description
//   const [descriptionNames, setDescriptionNames] = useState([]);

//   // Product Exclude
//   const [productExclude, setProductExclude] = useState([]);

//   // Product Extra
//   const [productExtra, setProductExtra] = useState([]);

//   // Product Variations
//   const [productVariations, setProductVariations] = useState([]);

//   // Product Category
//   const [selectedCategoryState, setSelectedCategoryState] = useState('Selected Category')
//   // const [selectedCategoryName, setSelectedCategoryName] = useState('')
//   const [selectedCategoryId, setSelectedCategoryId] = useState('')

//   // Product SubCategory
//   const [selectedSubCategoryState, setSelectedSubCategoryState] = useState('Selected Subcategory')
//   // const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('')
//   const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')

//   // Product Discount
//   const [selectedDiscountState, setSelectedDiscountState] = useState('Selected Discount')
//   // const [selectedDiscountName, setSelectedDiscountName] = useState('')
//   const [selectedDiscountId, setSelectedDiscountId] = useState('')

//   // Product Tax
//   const [selectedTaxState, setSelectedTaxState] = useState('Selected Tax')
//   // const [selectedTaxName, setSelectedTaxName] = useState('')
//   const [selectedTaxId, setSelectedTaxId] = useState('')

//   // Product Addons
//   const [selectedAddonsState, setSelectedAddonsState] = useState('Selected Addons')
//   // const [selectedAddonsName, setSelectedAddonsName] = useState('')
//   const [selectedAddonsId, setSelectedAddonsId] = useState([])

//   // Product Item Types
//   const [selectedItemTypeState, setSelectedItemTypeState] = useState('Selected Item Type')
//   const [selectedItemTypeName, setSelectedItemTypeName] = useState('')

//   // Product Stock Types
//   const [selectedStockTypeState, setSelectedStockTypeState] = useState('Selected Stock Type')
//   const [selectedStockTypeName, setSelectedStockTypeName] = useState('')
//   // Product Stock Number
//   const [productStockNumber, setProductStockNumber] = useState('')

//   // Product Price && Point
//   const [productPrice, setProductPrice] = useState('')
//   const [productPoint, setProductPoint] = useState('')


//   // Product From && To Status
//   const [productStatusFrom, setProductStatusFrom] = useState('')
//   const [productStatusTo, setProductStatusTo] = useState('')

//   // Product Status && Recommended && Time Status
//   const [productStatus, setProductStatus] = useState(0)
//   const [productRecommended, setProductRecommended] = useState(0)
//   const [productTimeStatus, setProductTimeStatus] = useState(0)

//   // Product Image
//   const [productImage, setProductImage] = useState(null)
//   const [productImageName, setProductImageName] = useState('Choose Photo')
//   /* dropdown Status */
//   const [isOPenProductCategory, setIsOPenProductCategory] = useState(false)
//   const [isOPenProductSubCategory, setIsOPenProductSubCategory] = useState(false)
//   const [isOPenProductItemType, setIsOPenProductItemType] = useState(false)
//   const [isOPenProductStockType, setIsOPenProductStockType] = useState(false)
//   const [isOPenProductDiscount, setIsOPenProductDiscount] = useState(false)
//   const [isOPenProductTax, setIsOPenProductTax] = useState(false)


//   /* Refetch Data */
//   useEffect(() => {
//     refetchTranslation(); // Get Language Translation data when the component mounts
//     refetchCategory(); // Get Categories && Addons && SubCategories data when the component mounts
//     refetchProduct(); // Get Discounts && Taxes data when the component mounts
//   }, [refetchTranslation, refetchCategory, refetchProduct]);

//   useEffect(() => {
//     /* Set data to Taps Languages Translation */
//     if (dataTranslation) {
//       setTaps(dataTranslation?.translation || []); // Update taps if dataTranslation exists
//     }
//     /* Set data to Categories && Addons && SubCategories */
//     if (dataCategory) {
//       setCategories([{ id: '', name: 'Select Category' }, ...dataCategory.parent_categories] || [])
//       setSubCategories([{ id: '', name: 'Select Subcategory ' }, ...dataCategory?.sub_categories] || [])
//       // setFilterSubCategories(dataCategory?.sub_categories || [])
//       setAddons(dataCategory?.addons || [])
//     }
//     /* Set data to Discounts && Taxes */
//     if (dataProduct) {
//       setDiscounts([{ id: '', name: 'Select Discount' }, ...dataProduct?.discounts] || []);
//       setTaxes([{ id: '', name: 'Select Tax' }, ...dataProduct?.taxes] || []);
//     }
//     /* Log Data */
//     console.log('dataTranslation', dataTranslation)
//     console.log('dataCategory', dataCategory)
//     console.log('dataProduct', dataProduct)
//   }, [dataTranslation, dataCategory, dataProduct]);

//   /* Handle Function */

//   useEffect(() => { console.log('productNames', productNames) }, [productNames])

//   // Exclude Product
//   const handleAddExclude = () => {
//     const newExclude = {
//       names: taps.map((tap) => ({
//         exclude_name: "",
//         tranlation_id: tap.id,
//         tranlation_name: tap.name
//       })),
//     };

//     setProductExclude((prevProductnewExclude) => [...prevProductnewExclude, newExclude]);
//   };

//   const handleRemoveExclude = (index) => {
//     setProductExclude((prevProductExclude) => prevProductExclude.filter((_, idx) => idx !== index));
//   };

//   //Extra Product
//   const handleAddExtra = () => {
//     const newExtra = {
//       names: taps.map((tap) => ({
//         extra_name: "",
//         tranlation_id: tap.id,
//         tranlation_name: tap.name
//       })),
//       extra_price: '' // Default price, can be updated by the user
//     };

//     setProductExtra((prevProductExtra) => [...prevProductExtra, newExtra]);
//   };

//   const handleRemoveExtra = (index) => {
//     setProductExtra((prevProductExtra) => prevProductExtra.filter((_, idx) => idx !== index));
//   };

//   const handleVariationNameChange = (updatedValue, indexVariation, tapName) => {
//     setProductVariations((prevProductVariations) =>
//       prevProductVariations.map((item, idx) =>
//         idx === indexVariation
//           ? {
//             ...item,
//             names: item.names.map((name) =>
//               name.tranlation_name === tapName
//                 ? { ...name, name: updatedValue }
//                 : name
//             ),
//           }
//           : item
//       )
//     );
//   };


//   useEffect(() => {
//     console.log('ProductExclude', productExclude)
//     console.log('ProductExtra', productExtra)
//   }, [productExtra, productExclude])



//   // Add a new Variation
//   const handleAddVariation = () => {
//     const newVariation = {
//       type: '',
//       required: 0,
//       min: '',
//       max: '',
//       names: taps.map(tap => ({
//         name: '',
//         tranlation_id: tap.id,
//         tranlation_name: tap.name,
//       })),
//       options: [
//         {
//           names: taps.map((tap) => ({
//             name: '',
//             tranlation_id: tap.id,
//             tranlation_name: tap.name,
//           })),
//           extra: [
//             {
//               extra_names: taps.map((tap) => ({
//                 extra_name: '',
//                 tranlation_id: tap.id,
//                 tranlation_name: tap.name,
//               })),
//               extra_price: '',
//             },
//           ],
//           points: '',
//           price: '',
//           status: 0,
//         },
//       ],
//     };
//     setProductVariations((prevVariations) => [...prevVariations, newVariation]);
//   };


//   // Remove a Variation
//   const handleRemoveVariation = (index) => {
//     setProductVariations((prevVariations) =>
//       prevVariations.filter((_, idx) => idx !== index)
//     );
//   };
//   // Option

//   // Example for updating nested options array
//   const updateVariationState = (setProductVariations, variationIndex, field, tapName, updatedValue) => {
//     setProductVariations(prevProductVariations =>
//       prevProductVariations.map((item, idx) =>
//         idx === variationIndex
//           ? {
//             ...item,
//             [field]: item[field].map(subField =>
//               subField.tranlation_name === tapName
//                 ? { ...subField, name: updatedValue }
//                 : subField
//             ),
//           }
//           : item
//       )
//     );
//   };


//   // Add a new Option to a specific Variation
//   const handleAddOption = (variationIndex) => {
//     const newOption = {
//       names: taps.map((tap) => ({
//         name: '',
//         tranlation_id: tap.id,
//         tranlation_name: tap.name,
//       })),
//       extra: [
//         {
//           extra_names: taps.map((tap) => ({
//             extra_name: '',
//             tranlation_id: tap.id,
//             tranlation_name: tap.name,
//           })),
//           extra_price: '',
//         },
//       ],
//       price: '',
//       points: '',
//       status: 0,
//     };

//     setProductVariations((prevVariations) =>
//       prevVariations.map((variation, idx) =>
//         idx === variationIndex
//           ? { ...variation, options: [...variation.options, newOption] }
//           : variation
//       )
//     );
//   };


//   // Add a new Extra to a specific Option within a Variation
//   const handleAddExtraAtOption = (variationIndex, optionIndex) => {
//     const newExtra = {
//       extra_names: taps.map((tap) => ({
//         extra_name: '',
//         tranlation_id: tap.id,
//         tranlation_name: tap.name,
//       })),
//       extra_price: '',
//     };

//     setProductVariations((prevVariations) =>
//       prevVariations.map((variation, vIdx) =>
//         vIdx === variationIndex
//           ? {
//             ...variation,
//             options: variation.options.map((option, oIdx) =>
//               oIdx === optionIndex
//                 ? { ...option, extra: [...option.extra, newExtra] }
//                 : option
//             ),
//           }
//           : variation
//       )
//     );
//   };

//   // Remove an option from a specific Option within a Variation
//   const handleRemoveOption = (variationIndex, optionIndex) => {
//     setProductVariations((prevVariations) =>
//       prevVariations.map((variation, vIdx) =>
//         vIdx === variationIndex
//           ? {
//             ...variation,
//             options: variation.options.filter((_, oIdx) => oIdx !== optionIndex),
//           }
//           : variation
//       )
//     );
//   };
//   // Remove an Extra from a specific Option within a Variation
//   const handleRemoveExtraAtOption = (variationIndex, optionIndex, extraIndex) => {
//     setProductVariations((prevVariations) =>
//       prevVariations.map((variation, vIdx) =>
//         vIdx === variationIndex
//           ? {
//             ...variation,
//             options: variation.options.map((option, oIdx) =>
//               oIdx === optionIndex
//                 ? {
//                   ...option,
//                   extra: option.extra.filter((_, eIdx) => eIdx !== extraIndex),
//                 }
//                 : option
//             ),
//           }
//           : variation
//       )
//     );
//   };



//   useEffect(() => {
//     console.log('productVariations', productVariations)
//   }, [productVariations])

//   // DropDowns
//   const handleOpenVariationType = (index) => {
//     setOpenVariationIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle open state for the selected index
//   };

//   const handleOpenOptionProductVariationType = () => {
//     setOpenVariationIndex(null); // Close the dropdown
//   };


//   const handleCloseAllDropdowns = () => {
//     setIsOPenProductCategory(false);
//     setIsOPenProductSubCategory(false);
//     setIsOPenProductItemType(false);
//     setIsOPenProductStockType(false);
//     setIsOPenProductDiscount(false);
//     setIsOPenProductTax(false);
//   };

//   const handleOpenCategory = () => {
//     handleCloseAllDropdowns()
//     setIsOPenProductCategory(!isOPenProductCategory);
//   };
//   const handleOpenSubCategory = () => {
//     handleCloseAllDropdowns()
//     setIsOPenProductSubCategory(!isOPenProductSubCategory);
//   };
//   const handleOpenItemType = () => {
//     handleCloseAllDropdowns()
//     setIsOPenProductItemType(!isOPenProductItemType);
//   };
//   const handleOpenStockType = () => {
//     handleCloseAllDropdowns()
//     setIsOPenProductStockType(!isOPenProductStockType);
//   };
//   const handleOpenDiscount = () => {
//     handleCloseAllDropdowns()
//     setIsOPenProductDiscount(!isOPenProductDiscount);
//   };
//   const handleOpenTax = () => {
//     handleCloseAllDropdowns()
//     setIsOPenProductTax(!isOPenProductTax);
//   };


//   const handleOpenOptionProductCategory = () => setIsOPenProductCategory(false);
//   const handleOpenOptionProductSubCategory = () => setIsOPenProductSubCategory(false);
//   const handleOpenOptionProductItemType = () => setIsOPenProductItemType(false);
//   const handleOpenOptionProductStockType = () => setIsOPenProductStockType(false);
//   const handleOpenOptionProductDiscount = () => setIsOPenProductDiscount(false);
//   const handleOpenOptionProductTax = () => setIsOPenProductTax(false);

//   const handleSelectProductVariationType = (option, variationIndex) => {
//     // Update the `type` of the variation at `variationIndex`
//     setProductVariations((prevProductVariations) =>
//       prevProductVariations.map((ele, index) =>
//         index === variationIndex
//           ? { ...ele, type: option.name, min: '', max: '' } // Update type with selected value
//           : ele
//       )
//     );
//   };



//   const handleSelectProductCategory = (option) => {
//     setSelectedCategoryId(option.id);
//     setSelectedCategoryState(option.name);
//     const filterSup = subCategories.filter(sup => sup.category_id === option.id)

//     setFilterSubCategories([{ id: '', name: 'Selected Subcategory' }, ...filterSup])
//     console.log('filterSup', filterSup)
//   };
//   const handleSelectProductSubCategory = (option) => {
//     setSelectedSubCategoryId(option.id);
//     setSelectedSubCategoryState(option.name);
//   };
//   const handleSelectProductItemType = (option) => {
//     setSelectedItemTypeName(option.id);
//     setSelectedItemTypeState(option.name);
//     console.log('option', option)
//   };
//   const handleSelectProductStockType = (option) => {
//     setSelectedStockTypeName(option.id);
//     setSelectedStockTypeState(option.name);
//     setProductStockNumber('');

//     console.log('SelectedStockTypeState', selectedStockTypeState)
//     console.log('SelectedStockTypeName', selectedStockTypeName)
//     console.log('productStockNumber', productStockNumber)
//     console.log('option', option)
//   };

//   const handleSelectProductDiscount = (option) => {
//     console.log('option', option)
//     setSelectedDiscountId(option.id);
//     setSelectedDiscountState(option.name);
//   };
//   const handleSelectProductTax = (option) => {
//     console.log('option', option)
//     setSelectedTaxId(option.id);
//     setSelectedTaxState(option.name);
//   };

//   const handleProductStatus = () => {
//     const currentState = productStatus;
//     { currentState === 0 ? setProductStatus(1) : setProductStatus(0) }
//   }

//   const handleProductRecommended = () => {
//     const currentState = productRecommended;
//     { currentState === 0 ? setProductRecommended(1) : setProductRecommended(0) }
//   }

//   const handleProductTimeStatus = () => {
//     const currentState = productTimeStatus;
//     { currentState === 0 ? setProductTimeStatus(1) : setProductTimeStatus(0) }
//     setProductStatusFrom(null)
//     setProductStatusTo(null)
//   }

//   // Image
//   const handleProductImageClick = (ref) => {
//     if (ref.current) {
//       ref.current.click();
//     }
//   };
//   const handleProductImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProductImage(file);
//       setProductImageName(file.name);
//     }
//   };


//   // Close All dropdowns if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         categoryRef.current && !categoryRef.current.contains(event.target) &&
//         subCategoryRef.current && !subCategoryRef.current.contains(event.target) &&
//         itemTypeRef.current && !itemTypeRef.current.contains(event.target) &&
//         stockTypeRef.current && !stockTypeRef.current.contains(event.target) &&
//         discountRef.current && !discountRef.current.contains(event.target) &&
//         taxRef.current && !taxRef.current.contains(event.target)
//       ) {
//         handleCloseAllDropdowns()
//       }

//       // Handle closing variation dropdowns
//       if (variationTypeRef.current) {
//         let clickedInsideAnyVariation = false;
//         for (let i = 0; i < variationTypeRef.current.length; i++) {
//           const ref = variationTypeRef.current[i];
//           if (ref && ref.contains(event.target)) {
//             clickedInsideAnyVariation = true;
//             break;
//           }
//         }

//         if (!clickedInsideAnyVariation) {
//           setOpenVariationIndex(null); // Close the variation dropdown
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [setIsOPenProductCategory, setIsOPenProductSubCategory, setIsOPenProductItemType, setIsOPenProductStockType, setIsOPenProductDiscount, setIsOPenProductTax, setOpenVariationIndex]);



//   // Go To Languages Tap About Product Names
//   const handleProductNamesTap = (index) => {
//     setCurrentProductNamesTap(index)
//   }
//   // Go To Languages Tap About Exclude Names
//   const handleExcludeNamesTap = (index) => {
//     setCurrentExcludeNamesTap(index)
//   }
//   // Go To Languages Tap About Extra Names
//   const handleExtraNamesTap = (index) => {
//     setCurrentExtraNamesTap(index)
//   }
//   // Go To Languages Tap About Product Variation
//   const handleVariationTap = (index) => {
//     setCurrentVariationTap(index)
//   }
//   // Go To Languages Tap About Product Variation
//   const handleVariationOptionTap = (index) => {
//     setCurrentVariationOptionTap(index)
//   }
//   useEffect(() => { console.log('descriptionNames', descriptionNames) }, [descriptionNames])
//   /* Reset Details Product */
//   const handleReset = () => {
//     console.log('productNames', productNames)
//     console.log('descriptionNames', descriptionNames)

//     setCurrentProductNamesTap(0)
//     setCurrentExcludeNamesTap(0)
//     setCurrentExtraNamesTap(0)
//     setCurrentVariationTap(0)
//     setCurrentVariationOptionTap(0)
//     setProductNames([])
//     setDescriptionNames([])
//     setProductExclude([])
//     setProductExtra([])
//     setProductVariations([])
//     setSelectedCategoryState('Selected Category')
//     setSelectedCategoryId('')
//     setSelectedSubCategoryState('Selected SubCategory')
//     setSelectedSubCategoryId('')
//     setSelectedDiscountState('Selected Discount')
//     setSelectedDiscountId('')
//     setSelectedTaxState('Selected Tax')
//     setSelectedTaxId('')
//     setSelectedAddonsState('Selected Addons')
//     setSelectedAddonsId('')
//     setSelectedItemTypeState('Selected Item Type')
//     setSelectedItemTypeName('')
//     setSelectedStockTypeState('Selected Stock Type')
//     setSelectedStockTypeName('')
//     setProductStockNumber('')
//     setProductPrice('')
//     setProductPoint('')
//     setProductStatusFrom('')
//     setProductStatusTo('')
//     setProductStatus(0)
//     setProductRecommended(0)
//     setProductTimeStatus(0)
//     setProductImage(null)
//     setProductImageName('Choose Photo')

//     console.log('productExtra', productExtra)

//   };
//   useEffect(() => { console.log('selectedAddonsId', selectedAddonsId) }, [selectedAddonsId])

//   /* Add Product */
//   const handleproductAdd = (e) => {
//     e.preventDefault();

//     // Filter out any invalid or empty entries in product Names
//     const validProductNames = productNames.filter(
//       (product) => product && product.tranlation_id && product.product_name && product.tranlation_name
//     );

//     if (validProductNames.length === 0) {
//       auth.toastError('Please enter a product name');
//       console.log('productNames', validProductNames);
//       return;
//     }

//     if (validProductNames.length !== taps.length) {
//       auth.toastError('Please enter all product names');
//       console.log('productNames', validProductNames);
//       return;
//     }

//     // if (productNames.length === 0) {
//     //   auth.toastError('please Enter product Name')
//     //   console.log('productNames', productNames)
//     //   return;
//     // }

//     // if (productNames.length !== taps.length) {
//     //   auth.toastError('please Enter All Product Names')
//     //   console.log('productNames', productNames)
//     //   return;
//     // }

//     if (!selectedCategoryId) {
//       auth.toastError('please Select Category Name')
//       console.log('selectedCategoryId', selectedCategoryId)
//       return;
//     }

//     // if (!selectedSubCategoryId) {
//     //   auth.toastError('please Select SubCategory Name')
//     //   console.log('selectedSubCategoryId', selectedSubCategoryId)
//     //   return;
//     // }

//     // if (selectedAddonsId.length === 0) {
//     //   auth.toastError('please Select Addons')
//     //   console.log('selectedAddonsId', selectedAddonsId)
//     //   return;
//     // }

//     if (!selectedItemTypeName) {
//       auth.toastError('please Enter Item Type')
//       console.log('selectedItemTypeName', selectedItemTypeName)
//       return;
//     }
//     if (!selectedStockTypeName) {
//       auth.toastError('please Select Stock Type')
//       console.log('selectedStockTypeName', selectedStockTypeName)
//       return;
//     }
//     if (selectedStockTypeName === 'daily' || selectedStockTypeName === 'fixed') {
//       if (!productStockNumber) {
//         auth.toastError('please Enter Stock Number')
//         console.log('productStockNumber', productStockNumber)
//         return;
//       }
//     }
//     if (!productPrice) {
//       auth.toastError('please Enter Product Price')
//       console.log('productPrice', productPrice)
//       return;
//     }
//     // if (!selectedDiscountId) {
//     //   auth.toastError('please Select Product Discount')
//     //   console.log('selectedDiscountId', selectedDiscountId)
//     //   return;
//     // }
//     // if (!selectedTaxId) {
//     //   auth.toastError('please Select Product Tax')
//     //   console.log('selectedTaxId', selectedTaxId)
//     //   return;
//     // }

//     // if (!productPoint) {
//     //   auth.toastError('please Enter Product Point')
//     //   console.log('productPoint', productPoint)
//     //   return;
//     // }
//     if (!productImage) {
//       auth.toastError('please Set Product Image')
//       console.log('productImage', productImage)
//       return;
//     }


//     // if (productExclude.length === 0) {
//     //   auth.toastError('please Enter Exclude Name')
//     //   console.log('productExclude', productExclude)
//     //   return;
//     // }

//     // for (const ex of productExclude) {
//     //   for (const name of ex.names) {
//     //     if (!name.exclude_name || name.exclude_name.trim() === '') {
//     //       auth.toastError('Please Enter All Exclude names');
//     //       console.log('productExclude', productExclude)
//     //       return;
//     //     }
//     //   }
//     // }




//     // Filter out any invalid or empty entries description Names
//     const validDescriptionNames = descriptionNames.filter(
//       (desc) => desc && desc.tranlation_id && desc.description_name && desc.tranlation_name
//     );

//     // if (validDescriptionNames.length === 0) {
//     //   auth.toastError('Please enter a description name');
//     //   console.log('descriptionNames', validDescriptionNames);
//     //   return;
//     // }

//     // if (validDescriptionNames.length !== taps.length) {
//     //   auth.toastError('Please enter all description names');
//     //   console.log('descriptionNames', validDescriptionNames);
//     //   return;
//     // }

//     if (Array.isArray(productVariations) && productVariations.length > 0) {
//       for (const [indexVar, variation] of productVariations.entries()) {
//         if (Array.isArray(variation.options)) {
//           for (const [indexOption, option] of variation.options.entries()) {
//             if (!Array.isArray(option.names) || option.names.length === 0) {
//               auth.toastError(`Option at index ${indexOption} in variation ${indexVar} must have at least one name`);
//               return;
//             }
//             for (const [indexOpNa, optionNa] of option.names.entries()) {
//               if (!optionNa.name || typeof optionNa.name !== 'string' || !optionNa.name.trim()) {
//                 auth.toastError(`Missing or invalid name at variations[${indexVar}][options][${indexOption}][names][${indexOpNa}]`);
//                 return;
//               }
//             }
//           }
//         }
//       }
//     }


//     if (productTimeStatus === 1) {
//       if (!productStatusFrom || !productStatusTo) {
//         auth.toastError("Both 'From' and 'To' fields are required when Product Time Status is enabled.");
//         return; // Stop execution to prevent submitting incomplete data
//       }
//     }

//     const formData = new FormData();
//     formData.append('category_id', selectedCategoryId)
//     formData.append('sub_category_id', selectedSubCategoryId)
//     formData.append('item_type', selectedItemTypeName)
//     formData.append('stock_type', selectedStockTypeName)
//     formData.append('number', productStockNumber)
//     formData.append('price', productPrice)
//     formData.append('discount_id', selectedDiscountId)
//     formData.append('tax_id', selectedTaxId)
//     formData.append('points', productPoint)

//     formData.append('product_time_status', productTimeStatus)
//     if (productStatusFrom) {
//       formData.append('from', productStatusFrom)
//     }
//     if (productStatusTo) {
//       formData.append('to', productStatusTo)
//     }
//     formData.append('recommended', productRecommended)
//     formData.append('status', productStatus)
//     formData.append('image', productImage)

//     if (selectedAddonsId.length > 0) {

//       const addonIds = selectedAddonsId.map((addon) => addon.id); // Extracts only the IDs

//       addonIds.forEach((id, indexID) => {
//         formData.append(`addons[${indexID}]`, id); // Appending each ID separately with 'addons[]'
//       });
//     }




//     {
//       productNames.forEach((name, index) => {
//         formData.append(`product_names[${index}][product_name]`, name.product_name);
//         formData.append(`product_names[${index}][tranlation_id]`, name.tranlation_id);
//         formData.append(`product_names[${index}][tranlation_name]`, name.tranlation_name);
//       })
//     }


//     {
//       descriptionNames.forEach((name, index) => {

//         formData.append(`product_descriptions[${index}][product_description]`, name.description_name)
//         formData.append(`product_descriptions[${index}][tranlation_name]`, name.tranlation_name)
//         formData.append(`product_descriptions[${index}][tranlation_id]`, name.tranlation_id)
//       })
//     }

//     if (Array.isArray(productExclude)) {
//       productExclude.forEach((exclude, index) => {
//         if (Array.isArray(exclude.names)) {
//           exclude.names.forEach((exName, exInd) => {
//             formData.append(`excludes[${index}][names][${exInd}][exclude_name]`, exName.exclude_name);
//             formData.append(`excludes[${index}][names][${exInd}][tranlation_id]`, exName.tranlation_id);
//             formData.append(`excludes[${index}][names][${exInd}][tranlation_name]`, exName.tranlation_name);
//           });
//         }

//       });
//     } else {
//       console.error("productExtra is not a valid array.");
//     }

//     if (Array.isArray(productExtra)) {
//       productExtra.forEach((extra, index) => {
//         if (Array.isArray(extra.names)) {
//           extra.names.forEach((exName, exInd) => {
//             formData.append(`extra[${index}][names][${exInd}][extra_name]`, exName.extra_name);
//             formData.append(`extra[${index}][names][${exInd}][tranlation_id]`, exName.tranlation_id);
//             formData.append(`extra[${index}][names][${exInd}][tranlation_name]`, exName.tranlation_name);
//           });
//         }

//         formData.append(`extra[${index}][extra_price]`, extra.extra_price);
//       });
//     } else {
//       console.error("productExtra is not a valid array.");
//     }

//     if (Array.isArray(productVariations)) {
//       productVariations.forEach((variation, indexVar) => {
//         // Validate and log variations to verify data integrity
//         console.log(`Processing variation index ${indexVar}`, variation);

//         /* Names */
//         if (Array.isArray(variation.names)) {
//           variation.names.forEach((name, index) => {
//             // Log data for verification
//             console.log(`Processing name at index ${index}:`, name);

//             // Append formData fields for names
//             formData.append(`variations[${indexVar}][names][${index}][name]`, name.name);
//             formData.append(`variations[${indexVar}][names][${index}][tranlation_name]`, name.tranlation_name);
//             formData.append(`variations[${indexVar}][names][${index}][tranlation_id]`, name.tranlation_id);
//           });
//         } else {
//           console.warn(`variation.names is not a valid array for variation index ${indexVar}`);
//         }

//         /* Options */
//         // if (Array.isArray(variation.options)) {
//         //   variation.options.forEach((option, indexOption) => {
//         //     console.log(`Processing option at index ${indexOption}:`, option);

//         //     // Extra Option Handling
//         //     if (Array.isArray(option.extra)) {
//         //       option.extra.forEach((extraOption, indexExtra) => {
//         //         console.log(`Processing extra option at index ${indexExtra}:`, extraOption);

//         //         if (Array.isArray(extraOption.extra_names)) {
//         //           extraOption.extra_names.forEach((extraName, indexNextra) => {
//         //             formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_names][${indexNextra}][extra_name]`,
//         //               extraName.extra_name);
//         //             formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_names][${indexNextra}][tranlation_name]`,
//         //               typeof extraName.tranlation_name === 'string' ? extraName.tranlation_name : '');
//         //             formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_names][${indexNextra}][tranlation_id]`,
//         //               extraName.tranlation_id !== undefined ? String(extraName.tranlation_id) : '');
//         //           });
//         //         } else {
//         //           console.warn(`extraOption.extra_names is not a valid array at index ${indexExtra}`);
//         //         }

//         //         formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_price]`, extraOption.extra_price);
//         //       });
//         //     }

//         //     // Names Option Handling
//         //     if (Array.isArray(option.names)) {
//         //       option.names.forEach((optionNa, indexOpNa) => {
//         //         console.log(`Processing option name at index ${indexOpNa}:`, optionNa);

//         //         formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`, optionNa.name);
//         //         formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_id]`,
//         //           optionNa.tranlation_id !== undefined ? String(optionNa.tranlation_id) : '');
//         //         formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_name]`,
//         //           typeof optionNa.tranlation_name === 'string' ? optionNa.tranlation_name : '');
//         //       });
//         //     }

//         //     // Append other option-specific data
//         //     formData.append(`variations[${indexVar}][options][${indexOption}][price]`, option.price);
//         //     formData.append(`variations[${indexVar}][options][${indexOption}][status]`, option.status);
//         //     formData.append(`variations[${indexVar}][options][${indexOption}][points]`, option.points);
//         //   });
//         // } else {
//         //   console.warn(`variation.options is not a valid array for variation index ${indexVar}`);
//         // }

//         if (Array.isArray(variation.options)) {
//           variation.options.forEach((option, indexOption) => {
//             console.log(`Processing option at index ${indexOption}:`, option);

//             // Extra Option Handling
//             if (Array.isArray(option.extra)) {
//               option.extra.forEach((extraOption, indexExtra) => {
//                 console.log(`Processing extra option at index ${indexExtra}:`, extraOption);

//                 if (Array.isArray(extraOption.extra_names)) {
//                   extraOption.extra_names.forEach((extraName, indexNextra) => {
//                     formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_names][${indexNextra}][extra_name]`,
//                       extraName.extra_name);
//                     formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_names][${indexNextra}][tranlation_name]`,
//                       typeof extraName.tranlation_name === 'string' ? extraName.tranlation_name : '');
//                     formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_names][${indexNextra}][tranlation_id]`,
//                       extraName.tranlation_id !== undefined ? String(extraName.tranlation_id) : '');
//                   });
//                 } else {
//                   console.warn(`extraOption.extra_names is not a valid array at index ${indexExtra}`);
//                 }

//                 formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_price]`, extraOption.extra_price || '0');
//               });
//             }

//             // Names Option Handling
//             if (Array.isArray(option.names) && option.names.length > 0) {
//               option.names.forEach((optionNa, indexOpNa) => {
//                 console.log(`Processing option name at index ${indexOpNa}:`, optionNa);

//                 if (optionNa.name && typeof optionNa.name === 'string') {
//                   formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`, optionNa.name);
//                 } else {
//                   console.warn(`Missing or invalid name at variations[${indexVar}][options][${indexOption}][names][${indexOpNa}]`);
//                   formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`, '');
//                 }

//                 formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_id]`,
//                   optionNa.tranlation_id !== undefined ? String(optionNa.tranlation_id) : '');
//                 formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_name]`,
//                   typeof optionNa.tranlation_name === 'string' ? optionNa.tranlation_name : '');
//               });
//             } else {
//               console.warn(`option.names is empty or not an array for option at index ${indexOption}`);
//             }

//             // Append other option-specific data
//             formData.append(`variations[${indexVar}][options][${indexOption}][price]`, option.price || '0');
//             formData.append(`variations[${indexVar}][options][${indexOption}][status]`, option.status || 'inactive');
//             formData.append(`variations[${indexVar}][options][${indexOption}][points]`, option.points || '0');
//           });
//         } else {
//           console.warn(`variation.options is not a valid array for variation index ${indexVar}`);
//         }

//         // Append general variation data
//         formData.append(`variations[${indexVar}][type]`, variation.type);
//         formData.append(`variations[${indexVar}][min]`, variation.min);
//         formData.append(`variations[${indexVar}][max]`, variation.max);
//         formData.append(`variations[${indexVar}][required]`, variation.required ? 1 : 0); // Convert boolean to 1/0
//       });
//     } else {
//       console.error("productVariations is not a valid array.");
//     }


//     for (const [key, value] of formData.entries()) {
//       console.log(`${key}: ${value}`);
//     }



//     postData(formData, 'Product Added Success')

//   };

//   useEffect(() => {
//     if (response && response.status === 200) {
//       handleReset();
//     }
//     console.log('response', response)
//   }, [response]);


//   return (
//     <>
//       {loadingTranslation || loadingCategory || loadingProduct || loadingPost ? (
//         <>
//           <div className="w-full flex justify-center items-center">
//             <LoaderLogin />
//           </div>
//         </>
//       ) : (

//         <form onSubmit={handleproductAdd} className='w-full flex flex-col items-center justify-center pb-24 gap-5'>
//           <div className="w-full flex flex-col items-start justify-start gap-5">

//             {/* Product Names && Description */}
//             <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

//               <div className="w-full flex items-center justify-start gap-x-6">
//                 {taps.map((tap, index) => (
//                   <span
//                     key={tap.id}
//                     onClick={() => handleProductNamesTap(index)}
//                     className={`${currentProductNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
//                   >
//                     {tap.name}
//                   </span>

//                 ))}
//               </div>

//               <div className="w-full">
//                 {taps.map((tap, index) => (
//                   currentProductNamesTap === index && (
//                     <div
//                       className="w-full flex sm:flex-col lg:flex-row items-center justify-start gap-4"
//                       key={tap.id}
//                     >
//                       {/* Product Name Input */}
//                       <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                         <span className="text-xl font-TextFontRegular text-thirdColor">Product Name {tap.name}:</span>
//                         <TextInput
//                           value={productNames[index]?.product_name} // Access category_name property
//                           onChange={(e) => {
//                             const inputValue = e.target.value; // Ensure this is a string
//                             setProductNames(prev => {
//                               const updatedProductNames = [...prev];

//                               // Ensure the array is long enough
//                               if (updatedProductNames.length <= index) {
//                                 updatedProductNames.length = index + 1; // Resize array
//                               }

//                               // Create or update the object at the current index
//                               updatedProductNames[index] = {
//                                 ...updatedProductNames[index], // Retain existing properties if any
//                                 'tranlation_id': tap.id, // Use the ID from tap
//                                 'product_name': inputValue, // Use the captured string value
//                                 'tranlation_name': tap.name || 'Default Name', // Use tap.name for tranlation_name
//                               };

//                               return updatedProductNames;
//                             });
//                           }}
//                           placeholder="Product Name"
//                         />
//                       </div>

//                       {/* Product Description Input */}
//                       <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                         <span className="text-xl font-TextFontRegular text-thirdColor">Product Description {tap.name}:</span>
//                         <TextInput
//                           value={descriptionNames[index]?.description_name} // Access category_name property
//                           onChange={(e) => {
//                             const inputValue = e.target.value; // Ensure this is a string
//                             setDescriptionNames(prev => {
//                               const updatedDescriptionNames = [...prev];

//                               // Ensure the array is long enough
//                               if (updatedDescriptionNames.length <= index) {
//                                 updatedDescriptionNames.length = index + 1; // Resize array
//                               }

//                               // Create or update the object at the current index
//                               updatedDescriptionNames[index] = {
//                                 ...updatedDescriptionNames[index], // Retain existing properties if any
//                                 'tranlation_id': tap.id, // Use the ID from tap
//                                 'description_name': inputValue, // Use the captured string value
//                                 'tranlation_name': tap.name || 'Default Name', // Use tap.name for tranlation_name
//                               };

//                               return updatedDescriptionNames;
//                             });
//                           }}
//                           placeholder="Product Description"
//                         />
//                       </div>

//                       {/* Conditional Rendering for First Tab Only */}
//                     </div>
//                   )
//                 ))}


//               </div>

//             </div>

//             {/* Product Details */}

//             {/* More Details */}
//             <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start  gap-5">
//               {/* Product Category  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Category Name:</span>
//                 <DropDown
//                   ref={categoryRef}
//                   handleOpen={handleOpenCategory}
//                   stateoption={selectedCategoryState}
//                   openMenu={isOPenProductCategory}
//                   handleOpenOption={handleOpenOptionProductCategory}
//                   options={categories}
//                   onSelectOption={handleSelectProductCategory}
//                 />
//               </div>
//               {/* Product SubCategory  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">SubCategory Name:</span>
//                 <DropDown
//                   ref={subCategoryRef}
//                   handleOpen={handleOpenSubCategory}
//                   stateoption={selectedSubCategoryState}
//                   openMenu={isOPenProductSubCategory}
//                   handleOpenOption={handleOpenOptionProductSubCategory}
//                   options={filterSubCategories}
//                   onSelectOption={handleSelectProductSubCategory}
//                 />
//               </div>
//               {/* Product Addons  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Addons Names:</span>
//                 <MultiSelect
//                   value={selectedAddonsId}
//                   onChange={(e) => setSelectedAddonsId(e.value)} // Assigns entire selected array
//                   options={addons}
//                   optionLabel="name"
//                   display="chip"
//                   placeholder={selectedAddonsState}
//                   maxSelectedLabels={3}
//                   className="w-full md:w-20rem bg-white shadow"
//                 />
//               </div>
//             </div>

//             <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-5">
//               {/* Product Item Type  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Item Type:</span>
//                 <DropDown
//                   ref={itemTypeRef}
//                   handleOpen={handleOpenItemType}
//                   stateoption={selectedItemTypeState}
//                   openMenu={isOPenProductItemType}
//                   handleOpenOption={handleOpenOptionProductItemType}
//                   options={itemTypes}
//                   onSelectOption={handleSelectProductItemType}
//                 />
//               </div>
//               {/* Product Stock Type  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Stock Type:</span>
//                 <DropDown
//                   ref={stockTypeRef}
//                   handleOpen={handleOpenStockType}
//                   stateoption={selectedStockTypeState}
//                   openMenu={isOPenProductStockType}
//                   handleOpenOption={handleOpenOptionProductStockType}
//                   options={stockTypes}
//                   onSelectOption={handleSelectProductStockType}
//                 />
//               </div>

//               {selectedStockTypeName === 'daily' || selectedStockTypeName === 'fixed' ? (
//                 <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                   <span className="text-xl font-TextFontRegular text-thirdColor">Number:</span>
//                   <NumberInput
//                     value={productStockNumber}
//                     onChange={(e) => setProductStockNumber(e.target.value)}
//                     placeholder={'Number'}
//                   />
//                 </div>
//               ) : ('')}

//               {/* Product Price */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Price:</span>
//                 <NumberInput
//                   value={productPrice}
//                   onChange={(e) => setProductPrice(e.target.value)}
//                   placeholder={'Price'}
//                 />
//               </div>
//             </div>

//             <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-5">
//               {/* Product Discount  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Discount Name:</span>
//                 <DropDown
//                   ref={discountRef}
//                   handleOpen={handleOpenDiscount}
//                   stateoption={selectedDiscountState}
//                   openMenu={isOPenProductDiscount}
//                   handleOpenOption={handleOpenOptionProductDiscount}
//                   options={discounts}
//                   onSelectOption={handleSelectProductDiscount}
//                 />
//               </div>
//               {/* Product Tax  */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Tax Name:</span>
//                 <DropDown
//                   ref={taxRef}
//                   handleOpen={handleOpenTax}
//                   stateoption={selectedTaxState}
//                   openMenu={isOPenProductTax}
//                   handleOpenOption={handleOpenOptionProductTax}
//                   options={taxes}
//                   onSelectOption={handleSelectProductTax}
//                 />
//               </div>
//               {/* Product Point */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
//                 <NumberInput
//                   value={productPoint}
//                   onChange={(e) => setProductPoint(e.target.value)}
//                   placeholder={'Point'}
//                 />
//               </div>
//             </div>

//             <div className="w-full flex sm:flex-col lg:flex-row items-start justify-start mt-2 gap-5">
//               {/* Product Image */}
//               {/* <div className="sm:w-full lg:w-[33%]  sm:flex-col lg:flex-row flex sm:items-start lg:items-center justify-start gap-x-3"> */}
//               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Product Image:</span>
//                 <UploadInput
//                   value={productImageName}
//                   uploadFileRef={productImageRef}
//                   placeholder="Product Image"
//                   handleFileChange={handleProductImageChange}
//                   onChange={(e) => setProductImage(e.target.value)}
//                   onClick={() => handleProductImageClick(productImageRef)}
//                 />
//               </div>

//               {productTimeStatus === 1 && (
//                 <>

//                   <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                     <span className="text-xl font-TextFontRegular text-thirdColor">From:</span>
//                     <TimeInput
//                       value={productStatusFrom ?? ''}
//                       onChange={(e) => setProductStatusFrom(e.target.value)}
//                     />
//                     {/* <input type="time" /> */}
//                   </div>

//                   <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                     <span className="text-xl font-TextFontRegular text-thirdColor">To:</span>
//                     <TimeInput
//                       value={productStatusTo ?? ''}
//                       onChange={(e) => setProductStatusTo(e.target.value)}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-4">

//               {/* Product Status */}
//               <div className='sm:w-full lg:w-[20%] flex items-center justify-start gap-x-3'>
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Status:</span>
//                 <Switch handleClick={handleProductStatus} checked={productStatus} />
//               </div>
//               {/* Product Product Recommended */}
//               <div className='sm:w-full lg:w-[40%] flex items-center justify-start gap-x-3'>
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Product Recommended:</span>
//                 <Switch handleClick={handleProductRecommended} checked={productRecommended} />
//               </div>
//               {/* Product Time Status */}
//               <div className='sm:w-full lg:w-[35%] flex items-center justify-start gap-x-3'>
//                 <span className="text-xl font-TextFontRegular text-thirdColor">Product Time Status:</span>
//                 <Switch handleClick={handleProductTimeStatus} checked={productTimeStatus} />
//               </div>

//             </div>

//             {/* Exclude Names */}
//             <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

//               {productExclude.length !== 0 && (


//                 <div className="w-full flex items-center justify-start gap-x-6">
//                   {taps.map((tap, index) => (
//                     <span
//                       key={tap.id}
//                       onClick={() => handleExcludeNamesTap(index)}
//                       className={`${currentExcludeNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
//                     >
//                       {tap.name}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <div className="w-full">
//                 {taps.map((tap, index) => (
//                   currentExcludeNamesTap === index && (
//                     <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
//                       {(productExclude || []).map((ele, indexMap) => (
//                         <div
//                           className="w-full flex items-center justify-start gap-5"
//                           key={`${tap.id}-${indexMap}`}
//                         >
//                           {/* Exclude Name Input */}
//                           <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                             <span className="text-xl font-TextFontRegular text-thirdColor">
//                               Exclude Name {tap.name}:
//                             </span>
//                             <TextInput
//                               value={ele.names.find(name => name.tranlation_name === tap.name)?.exclude_name}
//                               onChange={(e) => {
//                                 const updatedValue = e.target.value;
//                                 setProductExclude((prevProductExclude) =>
//                                   prevProductExclude.map((item, idx) =>
//                                     idx === indexMap
//                                       ? {
//                                         ...item,
//                                         names: item.names.map((name) =>
//                                           name.tranlation_name === tap.name
//                                             ? { ...name, exclude_name: updatedValue }
//                                             : name
//                                         ),
//                                       }
//                                       : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Exclude Name"
//                             />
//                           </div>

//                           {/* Remove Button */}
//                           {index === 0 && (
//                             <div className="flex items-end mt-10">
//                               <StaticButton
//                                 text="Remove"
//                                 handleClick={() => handleRemoveExclude(indexMap)}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                       {index === 0 && (
//                         <div className={`w-full flex items-center ${productExclude.length === 0 ? 'justify-center' : 'justify-start'}`}>
//                           <ButtonAdd
//                             isWidth={true}
//                             Color="mainColor"
//                             Text={productExclude.length === 0 ? 'Add Exclude' : 'Add More Exclude'}
//                             handleClick={handleAddExclude}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   )
//                 ))}
//               </div>

//             </div>

//             {/* Extra Names && Price */}
//             <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

//               {productExtra.length !== 0 && (
//                 <div className="w-full flex items-center justify-start gap-x-6">
//                   {taps.map((tap, index) => (
//                     <span
//                       key={tap.id}
//                       onClick={() => handleExtraNamesTap(index)}
//                       className={`${currentExtraNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
//                     >
//                       {tap.name}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <div className="w-full">
//                 {taps.map((tap, index) => (
//                   currentExtraNamesTap === index && (
//                     <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
//                       {(productExtra || []).map((ele, indexMap) => (
//                         <div
//                           className="w-full flex items-center justify-start gap-5"
//                           key={`${tap.id}-${indexMap}`}
//                         >
//                           {/* Extra Name Input */}
//                           <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                             <span className="text-xl font-TextFontRegular text-thirdColor">
//                               Extra Name {tap.name}:
//                             </span>
//                             <TextInput
//                               value={ele.names.find(name => name.tranlation_name === tap.name)?.extra_name}
//                               onChange={(e) => {
//                                 const updatedValue = e.target.value;
//                                 setProductExtra((prevProductExtra) =>
//                                   prevProductExtra.map((item, idx) =>
//                                     idx === indexMap
//                                       ? {
//                                         ...item,
//                                         names: item.names.map((name) =>
//                                           name.tranlation_name === tap.name
//                                             ? { ...name, extra_name: updatedValue }
//                                             : name
//                                         ),
//                                       }
//                                       : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Extra Name"
//                             />
//                           </div>

//                           {/* Extra Price Input (only for the first language tab) */}
//                           {index === 0 && (
//                             <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                               <span className="text-xl font-TextFontRegular text-thirdColor">
//                                 Price:
//                               </span>
//                               <NumberInput
//                                 value={ele.extra_price}
//                                 onChange={(e) => {
//                                   const updatedPrice = e.target.value;
//                                   setProductExtra((prevProductExtra) =>
//                                     prevProductExtra.map((item, idx) =>
//                                       idx === indexMap
//                                         ? { ...item, extra_price: updatedPrice }
//                                         : item
//                                     )
//                                   );
//                                 }}
//                                 placeholder="Price"
//                               />
//                             </div>
//                           )}

//                           {/* Remove Button */}
//                           {index === 0 && (
//                             <div className="flex items-end mt-10">
//                               <StaticButton
//                                 text="Remove"
//                                 handleClick={() => handleRemoveExtra(indexMap)}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                       {index === 0 && (
//                         <div className={`w-full flex items-center ${productExtra.length === 0 ? 'justify-center' : 'justify-start'}`}>
//                           <ButtonAdd
//                             isWidth={true}
//                             Color="mainColor"
//                             Text={productExtra.length === 0 ? 'Add Extra' : 'Add More Extra'}
//                             handleClick={handleAddExtra}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   )
//                 ))}
//               </div>

//             </div>

//             {/* Product Variations */}
//             <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

//               {productVariations.length !== 0 && (


//                 <div className="w-full flex items-center justify-start gap-x-6">
//                   {taps.map((tap, index) => (
//                     <span
//                       key={tap.id}
//                       onClick={() => handleVariationTap(index)}
//                       className={`${currentVariationTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
//                     >
//                       {tap.name}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <div className="w-full">
//                 {taps.map((tap, index) => (
//                   currentVariationTap === index && (
//                     <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
//                       {(productVariations || []).map((ele, indexVariation) => (
//                         <div
//                           className="w-full border-4 border-mainColor p-3 rounded-2xl  flex sm:flex-col lg:flex-row flex-wrap shadow  items-start justify-start gap-5"
//                           key={`${tap.id}-${indexVariation}`}
//                         >
//                           {/* Variation Name */}
//                           <div className="sm:w-full lg:w-[30%] flex sm:flex-col lg:flex-row items-start justify-start gap-5">
//                             <div className="w-full flex flex-col items-start justify-center gap-y-1">
//                               <span className="text-xl font-TextFontRegular text-thirdColor">
//                                 Variation Name {tap.name}:
//                               </span>
//                               <TextInput
//                                 value={ele.names.find(name => name.tranlation_name === tap.name)?.name}
//                                 onChange={(e) => updateVariationState(setProductVariations, indexVariation, 'names', tap.name, e.target.value)}
//                                 placeholder="Variation Name"
//                               />
//                             </div>
//                           </div>
//                           {index === 0 && (
//                             <>
//                               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                 <span className="text-xl font-TextFontRegular text-thirdColor">Variation Type:</span>
//                                 <DropDown
//                                   ref={(el) => (variationTypeRef.current[indexVariation] = el)} // Ensure correct indexing for refs
//                                   handleOpen={() => handleOpenVariationType(indexVariation)} // Pass index of current variation
//                                   stateoption={ele.type || 'Select Type'}
//                                   openMenu={openVariationIndex === indexVariation} // Open only if index matches the open state
//                                   handleOpenOption={handleOpenOptionProductVariationType}
//                                   options={[{ name: 'single' }, { name: 'multiple' }]}
//                                   onSelectOption={(option) => handleSelectProductVariationType(option, indexVariation)}
//                                 />
//                               </div>

//                               {ele.type === 'multiple' && (
//                                 <>
//                                   <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                     <span className="text-xl font-TextFontRegular text-thirdColor">Min:</span>
//                                     <NumberInput
//                                       value={ele.min}  // Ensure `ele.points` has a default if undefined
//                                       onChange={(e) => {
//                                         const updatedValue = e.target.value;
//                                         setProductVariations((prevProductVariations) =>
//                                           prevProductVariations.map((item, idx) =>
//                                             idx === indexVariation
//                                               ? {
//                                                 ...item,
//                                                 min: updatedValue, // Ensure this sets `points` correctly
//                                               }
//                                               : item
//                                           )
//                                         );
//                                       }}
//                                       placeholder={'Min'}
//                                     />
//                                   </div>

//                                   <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                     <span className="text-xl font-TextFontRegular text-thirdColor">Max:</span>
//                                     <NumberInput
//                                       value={ele.max}  // Ensure `ele.points` has a default if undefined
//                                       onChange={(e) => {
//                                         const updatedValue = e.target.value;
//                                         setProductVariations((prevProductVariations) =>
//                                           prevProductVariations.map((item, idx) =>
//                                             idx === indexVariation
//                                               ? {
//                                                 ...item,
//                                                 max: updatedValue, // Ensure this sets `points` correctly
//                                               }
//                                               : item
//                                           )
//                                         );
//                                       }}
//                                       placeholder={'Max'}
//                                     />
//                                   </div>
//                                 </>
//                               )}

//                               {/* <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                 <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
//                                 <NumberInput
//                                   value={ele.points}  // Ensure `ele.points` has a default if undefined
//                                   onChange={(e) => {
//                                     const updatedValue = e.target.value;
//                                     setProductVariations((prevProductVariations) =>
//                                       prevProductVariations.map((item, idx) =>
//                                         idx === indexVariation
//                                           ? {
//                                             ...item,
//                                             points: updatedValue, // Ensure this sets `points` correctly
//                                           }
//                                           : item
//                                       )
//                                     );
//                                   }}
//                                   placeholder={'Point'}
//                                 />
//                               </div> */}

//                               <div className='w-[32%] flex mt-10 items-center justify-center gap-x-3'>
//                                 <span className="text-xl font-TextFontRegular text-thirdColor">Required:</span>
//                                 <Switch
//                                   handleClick={() => {
//                                     setProductVariations((prevProductVariations) =>
//                                       prevProductVariations.map((item, idx) =>
//                                         idx === indexVariation
//                                           ? {
//                                             ...item,
//                                             required: item.required === 1 ? 0 : 1,  // Toggle between 1 and 0
//                                           }
//                                           : item
//                                       )
//                                     );
//                                   }}
//                                   checked={ele.required === 1}  // Consider it checked if `required` is 1
//                                 />

//                               </div>
//                               <div className="w-full">
//                                 <TitlePage text={'Options Variation'} />
//                               </div>
//                             </>
//                           )}


//                           {index === 0 && (
//                             <>
//                               {/* Options */}
//                               <div className="w-full flex items-center justify-start gap-x-6">
//                                 {/* Tabs for variation options */}
//                                 {taps.map((tap, index) => (
//                                   <span
//                                     key={tap.id}
//                                     onClick={() => handleVariationOptionTap(index)}
//                                     className={`${currentVariationOptionTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'} 
//                   pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
//                                   >
//                                     {tap.name}
//                                   </span>
//                                 ))}
//                               </div>

//                               {/* Render each variation's options */}
//                               {taps.map((tapOption, indexOptionTap) => (
//                                 currentVariationOptionTap === indexOptionTap && (
//                                   <div className="w-full flex flex-col items-start justify-start gap-4" key={tapOption.id}>
//                                     <div className="sm:w-full flex flex-wrap items-start justify-start gap-5">
//                                       {/* Render options */}
//                                       {ele.options.map((option, indexOption) => (
//                                         <div className="sm:w-full flex flex-wrap items-start justify-start gap-5 shadow-md p-5 pt-0 rounded-xl" key={`${indexOption}-${tapOption.id}`}>
//                                           {/* Option Name */}
//                                           <div className="w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                                             <span className="text-xl font-TextFontRegular text-thirdColor">
//                                               Option Name {tapOption.name}:
//                                             </span>
//                                             <TextInput
//                                               value={
//                                                 option.names.find(nameObj => nameObj.tranlation_name === tapOption.name)?.name
//                                               }
//                                               onChange={(e) => {
//                                                 const updatedValue = e.target.value;
//                                                 setProductVariations((prevVariations) =>
//                                                   prevVariations.map((variation, idx) =>
//                                                     idx === indexVariation
//                                                       ? {
//                                                         ...variation,
//                                                         options: variation.options.map((opt, optIdx) =>
//                                                           optIdx === indexOption
//                                                             ? {
//                                                               ...opt,
//                                                               names: opt.names.map((nameObj) =>
//                                                                 nameObj.tranlation_name === tapOption.name
//                                                                   ? { ...nameObj, name: updatedValue }
//                                                                   : nameObj
//                                                               ),
//                                                             }
//                                                             : opt
//                                                         ),
//                                                       }
//                                                       : variation
//                                                   )
//                                                 );
//                                               }}
//                                               placeholder="Option Name"
//                                             />
//                                           </div>
//                                           {indexOptionTap === 0 && (
//                                             <>
//                                               {/* Option Price */}
//                                               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Price:</span>
//                                                 <NumberInput
//                                                   value={option.price}
//                                                   onChange={(e) => {
//                                                     const updatedValue = e.target.value;
//                                                     setProductVariations((prevProductVariations) =>
//                                                       prevProductVariations.map((item, idx) =>
//                                                         idx === indexVariation
//                                                           ? {
//                                                             ...item,
//                                                             options: item.options.map((opt, optIdx) =>
//                                                               optIdx === indexOption
//                                                                 ? { ...opt, price: updatedValue }
//                                                                 : opt
//                                                             ),
//                                                           }
//                                                           : item
//                                                       )
//                                                     );
//                                                   }}
//                                                   placeholder="Price"
//                                                 />
//                                               </div>
//                                               <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
//                                                 <NumberInput
//                                                   value={option.points}  // Ensure `ele.points` has a default if undefined
//                                                   onChange={(e) => {
//                                                     const updatedValue = e.target.value;
//                                                     setProductVariations((prevProductVariations) =>
//                                                       prevProductVariations.map((item, idx) =>
//                                                         idx === indexVariation
//                                                           ? {
//                                                             ...item,
//                                                             options: item.options.map((opt, optIdx) =>
//                                                               optIdx === indexOption
//                                                                 ? { ...opt, points: updatedValue }
//                                                                 : opt
//                                                             ),
//                                                           }
//                                                           : item
//                                                       )
//                                                     );
//                                                   }}
//                                                   placeholder={'Point'}
//                                                 />
//                                               </div>

//                                               {/* Option Status */}
//                                               <div className="w-[20%] flex items-center justify-start gap-x-3 lg:mt-3">
//                                                 <span className="text-xl font-TextFontRegular text-thirdColor">Status:</span>
//                                                 <Switch
//                                                   handleClick={() =>
//                                                     setProductVariations((prevProductVariations) =>
//                                                       prevProductVariations.map((item, idx) =>
//                                                         idx === indexVariation
//                                                           ? {
//                                                             ...item,
//                                                             options: item.options.map((opt, optIdx) =>
//                                                               optIdx === indexOption
//                                                                 ? { ...opt, status: opt.status ? 0 : 1 }
//                                                                 : opt
//                                                             ),
//                                                           }
//                                                           : item
//                                                       )
//                                                     )
//                                                   }
//                                                   checked={option.status === 1}
//                                                 />
//                                               </div>

//                                             </>
//                                           )}


//                                           {/* Render extras for this option */}
//                                           {option.extra.map((extra, extraIndex) => (
//                                             <div className="w-full flex flex-wrap items-start justify-start gap-5" key={`${tapOption.id}-${indexOption}-${extraIndex}`}>
//                                               {/* Extra Name */}
//                                               <div className="w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
//                                                 <span className="text-xl font-TextFontRegular text-thirdColor">
//                                                   Extra Name {tapOption.name}:
//                                                 </span>
//                                                 <TextInput
//                                                   value={
//                                                     extra.extra_names.find(
//                                                       (extraNameObj) => extraNameObj.tranlation_name === tapOption.name
//                                                     )?.extra_name
//                                                   }
//                                                   onChange={(e) => {
//                                                     const updatedValue = e.target.value;
//                                                     setProductVariations((prevVariations) =>
//                                                       prevVariations.map((variation, idx) =>
//                                                         idx === indexVariation
//                                                           ? {
//                                                             ...variation,
//                                                             options: variation.options.map((opt, optIdx) =>
//                                                               optIdx === indexOption
//                                                                 ? {
//                                                                   ...opt,
//                                                                   extra: opt.extra.map((ext, extIdx) =>
//                                                                     extIdx === extraIndex
//                                                                       ? {
//                                                                         ...ext,
//                                                                         extra_names: ext.extra_names.map((nameObj) =>
//                                                                           nameObj.tranlation_name === tapOption.name
//                                                                             ? { ...nameObj, extra_name: updatedValue }
//                                                                             : nameObj
//                                                                         ),
//                                                                       }
//                                                                       : ext
//                                                                   ),
//                                                                 }
//                                                                 : opt
//                                                             ),
//                                                           }
//                                                           : variation
//                                                       )
//                                                     );
//                                                   }}
//                                                   placeholder="Extra Name"
//                                                 />
//                                               </div>

//                                               {indexOptionTap === 0 && (
//                                                 <>
//                                                   {/* Extra Price */}
//                                                   <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
//                                                     <span className="text-xl font-TextFontRegular text-thirdColor">Extra Price:</span>
//                                                     <NumberInput
//                                                       value={extra.extra_price}
//                                                       onChange={(e) => {
//                                                         const updatedValue = e.target.value;
//                                                         setProductVariations((prevVariations) =>
//                                                           prevVariations.map((variation, idx) =>
//                                                             idx === indexVariation
//                                                               ? {
//                                                                 ...variation,
//                                                                 options: variation.options.map((opt, optIdx) =>
//                                                                   optIdx === indexOption
//                                                                     ? {
//                                                                       ...opt,
//                                                                       extra: opt.extra.map((ext, extIdx) =>
//                                                                         extIdx === extraIndex
//                                                                           ? { ...ext, extra_price: updatedValue }
//                                                                           : ext
//                                                                       ),
//                                                                     }
//                                                                     : opt
//                                                                 ),
//                                                               }
//                                                               : variation
//                                                           )
//                                                         );
//                                                       }}
//                                                       placeholder="Extra Price"
//                                                     />
//                                                   </div>

//                                                   {/* Remove Extra Button */}
//                                                   <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
//                                                     <StaticButton
//                                                       text="Remove Extra"
//                                                       handleClick={() =>
//                                                         handleRemoveExtraAtOption(indexVariation, indexOption, extraIndex)
//                                                       }
//                                                     />
//                                                   </div>
//                                                 </>
//                                               )}
//                                             </div>
//                                           ))}

//                                           {/* Add Extra Button */}
//                                           <div className="sm:w-full flex items-center justify-center">
//                                             <ButtonAdd
//                                               isWidth={true}
//                                               Color="mainColor"
//                                               Text="Add Extra"
//                                               handleClick={() => handleAddExtraAtOption(indexVariation, indexOption)}
//                                             />
//                                           </div>
//                                           {ele.options.length > 1 && (

//                                             <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
//                                               <StaticButton
//                                                 text="Remove option"
//                                                 handleClick={() =>
//                                                   handleRemoveOption(indexVariation, indexOption)
//                                                 }
//                                               />
//                                             </div>
//                                           )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )
//                               ))}



//                               <div className="w-full flex flex-col gap-y-3">

//                                 <div className='sm:w-full flex items-center justify-center'>
//                                   <ButtonAdd
//                                     isWidth={true}
//                                     Color="mainColor"
//                                     Text={'Add Option'}
//                                     handleClick={() => handleAddOption(indexVariation)}
//                                   />
//                                 </div>

//                                 <div className='sm:w-full flex items-center justify-end'>
//                                   <div className='sm:w-full lg:w-auto'>
//                                     <StaticButton
//                                       text={'Remove Variation'}
//                                       handleClick={() => handleRemoveVariation(indexVariation)}
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </>
//                           )}

//                         </div>
//                       ))}
//                       {index === 0 && (
//                         <div className={`w-full flex items-center ${productVariations.length === 0 ? 'justify-center' : 'justify-start'}`}>
//                           <ButtonAdd
//                             isWidth={true}
//                             Color="mainColor"
//                             Text={productVariations.length === 0 ? 'Add Variation' : 'Add More Variation'}
//                             handleClick={handleAddVariation}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   )
//                 ))}
//               </div>

//             </div>

//           </div>


//           {/* Buttons*/}
//           <div className="w-full flex items-center justify-end gap-x-4">
//             <div>
//               <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
//             </div>
//             <div>
//               <SubmitButton
//                 text={'Add Product'}
//                 rounded='rounded-full'
//                 handleClick={handleproductAdd}
//               />
//             </div>

//           </div>

//         </form>
//       )}
//     </>
//   )
// }

// export default AddProductPage











import React, { useEffect, useRef, useState } from 'react'
import { useGet } from '../../../../Hooks/useGet';
import { DropDown, LoaderLogin, NumberInput, StaticButton, SubmitButton, Switch, TextInput, TimeInput, TitlePage, UploadInput } from '../../../../Components/Components';
import { usePost } from '../../../../Hooks/usePostJson';
import { MultiSelect } from 'primereact/multiselect';
import ButtonAdd from '../../../../Components/Buttons/AddButton';
import { useAuth } from '../../../../Context/Auth';

const AddProductPage = () => {
  const auth = useAuth();
  /* Get Data */
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchTranslation, loading: loadingTranslation, data: dataTranslation } = useGet({
    url: `${apiUrl}/admin/translation`
  });
  const { refetch: refetchCategory, loading: loadingCategory, data: dataCategory } = useGet({ url: `${apiUrl}/admin/category` });
  const { refetch: refetchProduct, loading: loadingProduct, data: dataProduct } = useGet({
    url: `${apiUrl}/admin/product`
  });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/product/add` });
  /* Refs */
  const variationTypeRef = useRef([]);
  const [openVariationIndex, setOpenVariationIndex] = useState(null); // Tracks which variation's dropdown is open


  const categoryRef = useRef();
  const subCategoryRef = useRef();
  const itemTypeRef = useRef();
  const stockTypeRef = useRef();
  const discountRef = useRef();
  const taxRef = useRef();
  const productImageRef = useRef();
  /* States */
  const [taps, setTaps] = useState([])
  const [currentProductNamesTap, setCurrentProductNamesTap] = useState(0);
  const [currentExcludeNamesTap, setCurrentExcludeNamesTap] = useState(0);
  const [currentExtraNamesTap, setCurrentExtraNamesTap] = useState(0);
  const [currentVariationTap, setCurrentVariationTap] = useState(0);
  const [currentVariationOptionTap, setCurrentVariationOptionTap] = useState(0);

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [filterSubCategories, setFilterSubCategories] = useState([])
  const [addons, setAddons] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [taxes, setTaxes] = useState([])

  const [itemTypes, setItemTypes] = useState([{ id: '', name: 'Selected Item Type' }, , { id: 'online', name: 'online' }, { id: 'offline', name: 'offline' }, { id: 'all', name: 'all' }])
  const [stockTypes, setStockTypes] = useState([{ id: '', name: 'Selected Stock Type' }, , { id: 'unlimited', name: 'unlimited' }, { id: 'daily', name: 'daily' }, { id: 'fixed', name: 'fixed' }])

  // Selected Data 
  // Product Names
  const [productNames, setProductNames] = useState([]);

  // Product Description
  const [descriptionNames, setDescriptionNames] = useState([]);

  // Product Exclude
  const [productExclude, setProductExclude] = useState([]);

  // Product Extra
  const [productExtra, setProductExtra] = useState([]);

  // Product Variations
  const [productVariations, setProductVariations] = useState([]);

  // Product Category
  const [selectedCategoryState, setSelectedCategoryState] = useState('Selected Category')
  // const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  // Product SubCategory
  const [selectedSubCategoryState, setSelectedSubCategoryState] = useState('Selected Subcategory')
  // const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')

  // Product Discount
  const [selectedDiscountState, setSelectedDiscountState] = useState('Selected Discount')
  // const [selectedDiscountName, setSelectedDiscountName] = useState('')
  const [selectedDiscountId, setSelectedDiscountId] = useState('')

  // Product Tax
  const [selectedTaxState, setSelectedTaxState] = useState('Selected Tax')
  // const [selectedTaxName, setSelectedTaxName] = useState('')
  const [selectedTaxId, setSelectedTaxId] = useState('')

  // Product Addons
  const [selectedAddonsState, setSelectedAddonsState] = useState('Selected Addons')
  // const [selectedAddonsName, setSelectedAddonsName] = useState('')
  const [selectedAddonsId, setSelectedAddonsId] = useState([])

  // Product Item Types
  const [selectedItemTypeState, setSelectedItemTypeState] = useState('Selected Item Type')
  const [selectedItemTypeName, setSelectedItemTypeName] = useState('')

  // Product Stock Types
  const [selectedStockTypeState, setSelectedStockTypeState] = useState('Selected Stock Type')
  const [selectedStockTypeName, setSelectedStockTypeName] = useState('')
  // Product Stock Number
  const [productStockNumber, setProductStockNumber] = useState('')

  // Product Price && Point
  const [productPrice, setProductPrice] = useState('')
  const [productPoint, setProductPoint] = useState('')


  // Product From && To Status
  const [productStatusFrom, setProductStatusFrom] = useState('')
  const [productStatusTo, setProductStatusTo] = useState('')

  // Product Status && Recommended && Time Status
  const [productStatus, setProductStatus] = useState(0)
  const [productRecommended, setProductRecommended] = useState(0)
  const [productTimeStatus, setProductTimeStatus] = useState(0)

  // Product Image
  const [productImage, setProductImage] = useState(null)
  const [productImageName, setProductImageName] = useState('Choose Photo')
  /* dropdown Status */
  const [isOPenProductCategory, setIsOPenProductCategory] = useState(false)
  const [isOPenProductSubCategory, setIsOPenProductSubCategory] = useState(false)
  const [isOPenProductItemType, setIsOPenProductItemType] = useState(false)
  const [isOPenProductStockType, setIsOPenProductStockType] = useState(false)
  const [isOPenProductDiscount, setIsOPenProductDiscount] = useState(false)
  const [isOPenProductTax, setIsOPenProductTax] = useState(false)


  /* Refetch Data */
  useEffect(() => {
    refetchTranslation(); // Get Language Translation data when the component mounts
    refetchCategory(); // Get Categories && Addons && SubCategories data when the component mounts
    refetchProduct(); // Get Discounts && Taxes data when the component mounts
  }, [refetchTranslation, refetchCategory, refetchProduct]);

  useEffect(() => {
    /* Set data to Taps Languages Translation */
    if (dataTranslation) {
      setTaps(dataTranslation?.translation || []); // Update taps if dataTranslation exists
    }
    /* Set data to Categories && Addons && SubCategories */
    if (dataCategory) {
      setCategories([{ id: '', name: 'Select Category' }, ...dataCategory.parent_categories] || [])
      setSubCategories([{ id: '', name: 'Select Subcategory ' }, ...dataCategory?.sub_categories] || [])
      // setFilterSubCategories(dataCategory?.sub_categories || [])
      setAddons(dataCategory?.addons || [])
    }
    /* Set data to Discounts && Taxes */
    if (dataProduct) {
      setDiscounts([{ id: '', name: 'Select Discount' }, ...dataProduct?.discounts] || []);
      setTaxes([{ id: '', name: 'Select Tax' }, ...dataProduct?.taxes] || []);
    }
    /* Log Data */
    console.log('dataTranslation', dataTranslation)
    console.log('dataCategory', dataCategory)
    console.log('dataProduct', dataProduct)
  }, [dataTranslation, dataCategory, dataProduct]);

  /* Handle Function */

  useEffect(() => { console.log('productNames', productNames) }, [productNames])

  // Exclude Product
  const handleAddExclude = () => {
    const newExclude = {
      names: taps.map((tap) => ({
        exclude_name: "",
        tranlation_id: tap.id,
        tranlation_name: tap.name
      })),
    };

    setProductExclude((prevProductnewExclude) => [...prevProductnewExclude, newExclude]);
  };

  const handleRemoveExclude = (index) => {
    setProductExclude((prevProductExclude) => prevProductExclude.filter((_, idx) => idx !== index));
  };

  //Extra Product
  // const handleAddExtra = () => {
  //   const newExtra = {
  //     names: taps.map((tap) => ({
  //       extra_name: "",
  //       tranlation_id: tap.id,
  //       tranlation_name: tap.name
  //     })),
  //     extra_price: '' // Default price, can be updated by the user
  //   };

  //   setProductExtra((prevProductExtra) => [...prevProductExtra, newExtra]);
  // };

  const handleRemoveExtra = (index) => {
    setProductExtra((prevProductExtra) => prevProductExtra.filter((_, idx) => idx !== index));
  };

  const handleVariationNameChange = (updatedValue, indexVariation, tapName) => {
    setProductVariations((prevProductVariations) =>
      prevProductVariations.map((item, idx) =>
        idx === indexVariation
          ? {
            ...item,
            names: item.names.map((name) =>
              name.tranlation_name === tapName
                ? { ...name, name: updatedValue }
                : name
            ),
          }
          : item
      )
    );
  };


  useEffect(() => {
    console.log('ProductExclude', productExclude)
    console.log('ProductExtra', productExtra)
  }, [productExtra, productExclude])



  // Add a new Variation
  const handleAddVariation = () => {
    const newVariation = {
      type: '',
      required: 0,
      min: '',
      max: '',
      names: taps.map(tap => ({
        name: '',
        tranlation_id: tap.id,
        tranlation_name: tap.name,
      })),
      options: [
        {
          names: taps.map((tap) => ({
            name: '',
            tranlation_id: tap.id,
            tranlation_name: tap.name,
          })),
          extra: [
            {
              extra_names: taps.map((tap) => ({
                extra_name: '',
                tranlation_id: tap.id,
                tranlation_name: tap.name,
              })),
              extra_price: '',
            },
          ],
          points: '',
          price: '',
          status: 0,
        },
      ],
    };
    setProductVariations((prevVariations) => [...prevVariations, newVariation]);
  };


  // Remove a Variation
  const handleRemoveVariation = (index) => {
    setProductVariations((prevVariations) =>
      prevVariations.filter((_, idx) => idx !== index)
    );
  };
  // Option

  // Example for updating nested options array
  const updateVariationState = (setProductVariations, variationIndex, field, tapName, updatedValue) => {
    setProductVariations(prevProductVariations =>
      prevProductVariations.map((item, idx) =>
        idx === variationIndex
          ? {
            ...item,
            [field]: item[field].map(subField =>
              subField.tranlation_name === tapName
                ? { ...subField, name: updatedValue }
                : subField
            ),
          }
          : item
      )
    );
  };


  // Add a new Option to a specific Variation
  const handleAddOption = (variationIndex) => {
    const newOption = {
      names: taps.map((tap) => ({
        name: '',
        tranlation_id: tap.id,
        tranlation_name: tap.name,
      })),
      extra: [
        {
          extra_names: taps.map((tap) => ({
            extra_name: '',
            tranlation_id: tap.id,
            tranlation_name: tap.name,
          })),
          extra_price: '',
        },
      ],
      price: '',
      points: '',
      status: 0,
    };

    setProductVariations((prevVariations) =>
      prevVariations.map((variation, idx) =>
        idx === variationIndex
          ? { ...variation, options: [...variation.options, newOption] }
          : variation
      )
    );
  };

  useEffect(() => {
    console.log('productVariations', productVariations)
  }, [productVariations])

  // DropDowns
  const handleOpenVariationType = (index) => {
    setOpenVariationIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle open state for the selected index
  };

  const handleOpenOptionProductVariationType = () => {
    setOpenVariationIndex(null); // Close the dropdown
  };
  const handleCloseAllDropdowns = () => {
    setIsOPenProductCategory(false);
    setIsOPenProductSubCategory(false);
    setIsOPenProductItemType(false);
    setIsOPenProductStockType(false);
    setIsOPenProductDiscount(false);
    setIsOPenProductTax(false);
  };
  const handleOpenCategory = () => {
    handleCloseAllDropdowns()
    setIsOPenProductCategory(!isOPenProductCategory);
  };
  const handleOpenSubCategory = () => {
    handleCloseAllDropdowns()
    setIsOPenProductSubCategory(!isOPenProductSubCategory);
  };
  const handleOpenItemType = () => {
    handleCloseAllDropdowns()
    setIsOPenProductItemType(!isOPenProductItemType);
  };
  const handleOpenStockType = () => {
    handleCloseAllDropdowns()
    setIsOPenProductStockType(!isOPenProductStockType);
  };
  const handleOpenDiscount = () => {
    handleCloseAllDropdowns()
    setIsOPenProductDiscount(!isOPenProductDiscount);
  };
  const handleOpenTax = () => {
    handleCloseAllDropdowns()
    setIsOPenProductTax(!isOPenProductTax);
  };


  const handleOpenOptionProductCategory = () => setIsOPenProductCategory(false);
  const handleOpenOptionProductSubCategory = () => setIsOPenProductSubCategory(false);
  const handleOpenOptionProductItemType = () => setIsOPenProductItemType(false);
  const handleOpenOptionProductStockType = () => setIsOPenProductStockType(false);
  const handleOpenOptionProductDiscount = () => setIsOPenProductDiscount(false);
  const handleOpenOptionProductTax = () => setIsOPenProductTax(false);

  const handleSelectProductVariationType = (option, variationIndex) => {
    // Update the `type` of the variation at `variationIndex`
    setProductVariations((prevProductVariations) =>
      prevProductVariations.map((ele, index) =>
        index === variationIndex
          ? { ...ele, type: option.name, min: '', max: '' } // Update type with selected value
          : ele
      )
    );
  };
  const handleSelectProductCategory = (option) => {
    setSelectedCategoryId(option.id);
    setSelectedCategoryState(option.name);
    const filterSup = subCategories.filter(sup => sup.category_id === option.id)

    setFilterSubCategories([{ id: '', name: 'Selected Subcategory' }, ...filterSup])
    console.log('filterSup', filterSup)
  };
  const handleSelectProductSubCategory = (option) => {
    setSelectedSubCategoryId(option.id);
    setSelectedSubCategoryState(option.name);
  };
  const handleSelectProductItemType = (option) => {
    setSelectedItemTypeName(option.id);
    setSelectedItemTypeState(option.name);
    console.log('option', option)
  };
  const handleSelectProductStockType = (option) => {
    setSelectedStockTypeName(option.id);
    setSelectedStockTypeState(option.name);
    setProductStockNumber('');

    console.log('SelectedStockTypeState', selectedStockTypeState)
    console.log('SelectedStockTypeName', selectedStockTypeName)
    console.log('productStockNumber', productStockNumber)
    console.log('option', option)
  };
  const handleSelectProductDiscount = (option) => {
    console.log('option', option)
    setSelectedDiscountId(option.id);
    setSelectedDiscountState(option.name);
  };
  const handleSelectProductTax = (option) => {
    console.log('option', option)
    setSelectedTaxId(option.id);
    setSelectedTaxState(option.name);
  };
  const handleProductStatus = () => {
    const currentState = productStatus;
    { currentState === 0 ? setProductStatus(1) : setProductStatus(0) }
  }
  const handleProductRecommended = () => {
    const currentState = productRecommended;
    { currentState === 0 ? setProductRecommended(1) : setProductRecommended(0) }
  }
  const handleProductTimeStatus = () => {
    const currentState = productTimeStatus;
    { currentState === 0 ? setProductTimeStatus(1) : setProductTimeStatus(0) }
    setProductStatusFrom(null)
    setProductStatusTo(null)
  }
  // Image
  const handleProductImageClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setProductImageName(file.name);
    }
  };


  // Close All dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryRef.current && !categoryRef.current.contains(event.target) &&
        subCategoryRef.current && !subCategoryRef.current.contains(event.target) &&
        itemTypeRef.current && !itemTypeRef.current.contains(event.target) &&
        stockTypeRef.current && !stockTypeRef.current.contains(event.target) &&
        discountRef.current && !discountRef.current.contains(event.target) &&
        taxRef.current && !taxRef.current.contains(event.target)
      ) {
        handleCloseAllDropdowns()
      }

      // Handle closing variation dropdowns
      if (variationTypeRef.current) {
        let clickedInsideAnyVariation = false;
        for (let i = 0; i < variationTypeRef.current.length; i++) {
          const ref = variationTypeRef.current[i];
          if (ref && ref.contains(event.target)) {
            clickedInsideAnyVariation = true;
            break;
          }
        }

        if (!clickedInsideAnyVariation) {
          setOpenVariationIndex(null); // Close the variation dropdown
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOPenProductCategory, setIsOPenProductSubCategory, setIsOPenProductItemType, setIsOPenProductStockType, setIsOPenProductDiscount, setIsOPenProductTax, setOpenVariationIndex]);



  // Go To Languages Tap About Product Names
  const handleProductNamesTap = (index) => {
    setCurrentProductNamesTap(index)
  }
  // Go To Languages Tap About Exclude Names
  const handleExcludeNamesTap = (index) => {
    setCurrentExcludeNamesTap(index)
  }
  // Go To Languages Tap About Extra Names
  const handleExtraNamesTap = (index) => {
    setCurrentExtraNamesTap(index)
  }
  // Go To Languages Tap About Product Variation
  const handleVariationTap = (index) => {
    setCurrentVariationTap(index)
  }
  // Go To Languages Tap About Product Variation
  const handleVariationOptionTap = (index) => {
    setCurrentVariationOptionTap(index)
  }
  useEffect(() => { console.log('descriptionNames', descriptionNames) }, [descriptionNames])
  /* Reset Details Product */
  const handleReset = () => {
    console.log('productNames', productNames)
    console.log('descriptionNames', descriptionNames)

    setCurrentProductNamesTap(0)
    setCurrentExcludeNamesTap(0)
    setCurrentExtraNamesTap(0)
    setCurrentVariationTap(0)
    setCurrentVariationOptionTap(0)
    setProductNames([])
    setDescriptionNames([])
    setProductExclude([])
    setProductExtra([])
    setProductVariations([])
    setSelectedCategoryState('Selected Category')
    setSelectedCategoryId('')
    setSelectedSubCategoryState('Selected SubCategory')
    setSelectedSubCategoryId('')
    setSelectedDiscountState('Selected Discount')
    setSelectedDiscountId('')
    setSelectedTaxState('Selected Tax')
    setSelectedTaxId('')
    setSelectedAddonsState('Selected Addons')
    setSelectedAddonsId('')
    setSelectedItemTypeState('Selected Item Type')
    setSelectedItemTypeName('')
    setSelectedStockTypeState('Selected Stock Type')
    setSelectedStockTypeName('')
    setProductStockNumber('')
    setProductPrice('')
    setProductPoint('')
    setProductStatusFrom('')
    setProductStatusTo('')
    setProductStatus(0)
    setProductRecommended(0)
    setProductTimeStatus(0)
    setProductImage(null)
    setProductImageName('Choose Photo')

    console.log('productExtra', productExtra)

  };
  useEffect(() => { console.log('selectedAddonsId', selectedAddonsId) }, [selectedAddonsId])

  
  // State for controlling extra dropdowns
  const [openExtraDropdown, setOpenExtraDropdown] = useState(null);
  const extraDropdownRef = useRef([]);

  const handleOpenExtraDropdown = (variationIndex, optionIndex, extraIndex) => {
    const key = `${variationIndex}-${optionIndex}-${extraIndex}`;
    setOpenExtraDropdown(openExtraDropdown === key ? null : key);
  };

  // Modify your handleAddExtra function to include extra_index
  const handleAddExtra = () => {
    setProductExtra(prev => [
      ...prev,
      {
        names: taps.map(tap => ({
          extra_name: "",
          tranlation_name: tap.name,
          tranlation_id: tap.id
        })),
        extra_price: "",
        extra_index: prev.length // This will be the index
      }
    ]);
  };
  // Modify your handleAddExtraAtOption function
  const handleAddExtraAtOption = (variationIndex, optionIndex) => {
    setProductVariations(prev =>
      prev.map((variation, vIdx) =>
        vIdx === variationIndex
          ? {
              ...variation,
              options: variation.options.map((option, oIdx) =>
                oIdx === optionIndex
                  ? {
                      ...option,
                      extra: [
                        ...option.extra,
                        {
                          extra_index: productExtra.length === 1 ? 0 : undefined,
                          extra_price: productExtra.length === 1 ? productExtra[0].extra_price : "",
                          extra_names: productExtra.length === 1 
                            ? productExtra[0].names 
                            : taps.map(tap => ({
                                extra_name: "",
                                tranlation_name: tap.name,
                                tranlation_id: tap.id
                              }))
                        }
                      ]
                    }
                  : option
              )
            }
          : variation
      )
    );
  };
  // Remove an option from a specific Option within a Variation
  const handleRemoveOption = (variationIndex, optionIndex) => {
    setProductVariations((prevVariations) =>
      prevVariations.map((variation, vIdx) =>
        vIdx === variationIndex
          ? {
            ...variation,
            options: variation.options.filter((_, oIdx) => oIdx !== optionIndex),
          }
          : variation
      )
    );
  };
  // Remove an Extra from a specific Option within a Variation
  const handleRemoveExtraAtOption = (variationIndex, optionIndex, extraIndex) => {
    setProductVariations((prevVariations) =>
      prevVariations.map((variation, vIdx) =>
        vIdx === variationIndex
          ? {
            ...variation,
            options: variation.options.map((option, oIdx) =>
              oIdx === optionIndex
                ? {
                  ...option,
                  extra: option.extra.filter((_, eIdx) => eIdx !== extraIndex),
                }
                : option
            ),
          }
          : variation
      )
    );
  };

  // Handle extra name change
const handleExtraNameChange = (indexMap, language, value) => {
  setProductExtra(prev => 
    prev.map((item, idx) =>
      idx === indexMap
        ? {
            ...item,
            names: item.names.map(name =>
              name.tranlation_name === language
                ? { ...name, extra_name: value }
                : name
            )
          }
        : item
    )
  );
};

// Handle extra price change (in extras section)
const handleExtraPriceChange = (indexMap, price) => {
  setProductExtra(prev => 
    prev.map((item, idx) =>
      idx === indexMap
        ? { ...item, extra_price: price }
        : item
    )
  );
};

// Handle price override in variations
const handleExtraPriceOverride = (variationIndex, optionIndex, extraIndex, price) => {
  setProductVariations(prev => 
    prev.map((variation, vIdx) =>
      vIdx === variationIndex
        ? {
            ...variation,
            options: variation.options.map((option, oIdx) =>
              oIdx === optionIndex
                ? {
                    ...option,
                    extra: option.extra.map((ext, eIdx) =>
                      eIdx === extraIndex
                        ? { ...ext, extra_price: price }
                        : ext
                    )
                  }
                : option
            )
          }
        : variation
    )
  );
};

  /* Add Product */
  const handleproductAdd = (e) => {
    e.preventDefault();

    // // Filter out any invalid or empty entries in product Names
    // const validProductNames = productNames.filter(
    //   (product) => product && product.tranlation_id && product.product_name && product.tranlation_name
    // );

    // if (validProductNames.length === 0) {
    //   auth.toastError('Please enter a product name');
    //   console.log('productNames', validProductNames);
    //   return;
    // }

    // if (validProductNames.length !== taps.length) {
    //   auth.toastError('Please enter all product names');
    //   console.log('productNames', validProductNames);
    //   return;
    // }

    // // if (productNames.length === 0) {
    // //   auth.toastError('please Enter product Name')
    // //   console.log('productNames', productNames)
    // //   return;
    // // }

    // // if (productNames.length !== taps.length) {
    // //   auth.toastError('please Enter All Product Names')
    // //   console.log('productNames', productNames)
    // //   return;
    // // }

    // if (!selectedCategoryId) {
    //   auth.toastError('please Select Category Name')
    //   console.log('selectedCategoryId', selectedCategoryId)
    //   return;
    // }

    // // if (!selectedSubCategoryId) {
    // //   auth.toastError('please Select SubCategory Name')
    // //   console.log('selectedSubCategoryId', selectedSubCategoryId)
    // //   return;
    // // }

    // // if (selectedAddonsId.length === 0) {
    // //   auth.toastError('please Select Addons')
    // //   console.log('selectedAddonsId', selectedAddonsId)
    // //   return;
    // // }

    // if (!selectedItemTypeName) {
    //   auth.toastError('please Enter Item Type')
    //   console.log('selectedItemTypeName', selectedItemTypeName)
    //   return;
    // }
    // if (!selectedStockTypeName) {
    //   auth.toastError('please Select Stock Type')
    //   console.log('selectedStockTypeName', selectedStockTypeName)
    //   return;
    // }
    // if (selectedStockTypeName === 'daily' || selectedStockTypeName === 'fixed') {
    //   if (!productStockNumber) {
    //     auth.toastError('please Enter Stock Number')
    //     console.log('productStockNumber', productStockNumber)
    //     return;
    //   }
    // }
    // if (!productPrice) {
    //   auth.toastError('please Enter Product Price')
    //   console.log('productPrice', productPrice)
    //   return;
    // }
    // // if (!selectedDiscountId) {
    // //   auth.toastError('please Select Product Discount')
    // //   console.log('selectedDiscountId', selectedDiscountId)
    // //   return;
    // // }
    // // if (!selectedTaxId) {
    // //   auth.toastError('please Select Product Tax')
    // //   console.log('selectedTaxId', selectedTaxId)
    // //   return;
    // // }

    // // if (!productPoint) {
    // //   auth.toastError('please Enter Product Point')
    // //   console.log('productPoint', productPoint)
    // //   return;
    // // }
    // if (!productImage) {
    //   auth.toastError('please Set Product Image')
    //   console.log('productImage', productImage)
    //   return;
    // }


    // // if (productExclude.length === 0) {
    // //   auth.toastError('please Enter Exclude Name')
    // //   console.log('productExclude', productExclude)
    // //   return;
    // // }

    // // for (const ex of productExclude) {
    // //   for (const name of ex.names) {
    // //     if (!name.exclude_name || name.exclude_name.trim() === '') {
    // //       auth.toastError('Please Enter All Exclude names');
    // //       console.log('productExclude', productExclude)
    // //       return;
    // //     }
    // //   }
    // // }




    // // Filter out any invalid or empty entries description Names
    // const validDescriptionNames = descriptionNames.filter(
    //   (desc) => desc && desc.tranlation_id && desc.description_name && desc.tranlation_name
    // );

    // if (validDescriptionNames.length === 0) {
    //   auth.toastError('Please enter a description name');
    //   console.log('descriptionNames', validDescriptionNames);
    //   return;
    // }

    // if (validDescriptionNames.length !== taps.length) {
    //   auth.toastError('Please enter all description names');
    //   console.log('descriptionNames', validDescriptionNames);
    //   return;
    // }

    // if (Array.isArray(productVariations) && productVariations.length > 0) {
    //   for (const [indexVar, variation] of productVariations.entries()) {
    //     if (Array.isArray(variation.options)) {
    //       for (const [indexOption, option] of variation.options.entries()) {
    //         if (!Array.isArray(option.names) || option.names.length === 0) {
    //           auth.toastError(`Option at index ${indexOption} in variation ${indexVar} must have at least one name`);
    //           return;
    //         }
    //         for (const [indexOpNa, optionNa] of option.names.entries()) {
    //           if (!optionNa.name || typeof optionNa.name !== 'string' || !optionNa.name.trim()) {
    //             auth.toastError(`Missing or invalid name at variations[${indexVar}][options][${indexOption}][names][${indexOpNa}]`);
    //             return;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }


    // if (productTimeStatus === 1) {
    //   if (!productStatusFrom || !productStatusTo) {
    //     auth.toastError("Both 'From' and 'To' fields are required when Product Time Status is enabled.");
    //     return; // Stop execution to prevent submitting incomplete data
    //   }
    // }

    const formData = new FormData();
    formData.append('category_id', selectedCategoryId)
    formData.append('sub_category_id', selectedSubCategoryId)
    formData.append('item_type', selectedItemTypeName)
    formData.append('stock_type', selectedStockTypeName)
    formData.append('number', productStockNumber)
    formData.append('price', productPrice)
    formData.append('discount_id', selectedDiscountId)
    formData.append('tax_id', selectedTaxId)
    formData.append('points', productPoint)

    formData.append('product_time_status', productTimeStatus)
    if (productStatusFrom) {
      formData.append('from', productStatusFrom)
    }
    if (productStatusTo) {
      formData.append('to', productStatusTo)
    }
    formData.append('recommended', productRecommended)
    formData.append('status', productStatus)
    formData.append('image', productImage)

    if (selectedAddonsId.length > 0) {

      const addonIds = selectedAddonsId.map((addon) => addon.id); // Extracts only the IDs

      addonIds.forEach((id, indexID) => {
        formData.append(`addons[${indexID}]`, id); // Appending each ID separately with 'addons[]'
      });
    }




    {
      productNames.forEach((name, index) => {
        formData.append(`product_names[${index}][product_name]`, name.product_name);
        formData.append(`product_names[${index}][tranlation_id]`, name.tranlation_id);
        formData.append(`product_names[${index}][tranlation_name]`, name.tranlation_name);
      })
    }


    {
      descriptionNames.forEach((name, index) => {

        formData.append(`product_descriptions[${index}][product_description]`, name.description_name)
        formData.append(`product_descriptions[${index}][tranlation_name]`, name.tranlation_name)
        formData.append(`product_descriptions[${index}][tranlation_id]`, name.tranlation_id)
      })
    }

    if (Array.isArray(productExclude)) {
      productExclude.forEach((exclude, index) => {
        if (Array.isArray(exclude.names)) {
          exclude.names.forEach((exName, exInd) => {
            formData.append(`excludes[${index}][names][${exInd}][exclude_name]`, exName.exclude_name);
            formData.append(`excludes[${index}][names][${exInd}][tranlation_id]`, exName.tranlation_id);
            formData.append(`excludes[${index}][names][${exInd}][tranlation_name]`, exName.tranlation_name);
          });
        }

      });
    } else {
      console.error("productExtra is not a valid array.");
    }

    if (Array.isArray(productExtra)) {
      productExtra.forEach((extra, index) => {
        if (Array.isArray(extra.names)) {
          extra.names.forEach((exName, exInd) => {
            formData.append(`extra[${index}][names][${exInd}][extra_name]`, exName.extra_name);
            formData.append(`extra[${index}][names][${exInd}][tranlation_id]`, exName.tranlation_id);
            formData.append(`extra[${index}][names][${exInd}][tranlation_name]`, exName.tranlation_name);
          });
        }

        formData.append(`extra[${index}][extra_price]`, extra.extra_price);
      });
    } else {
      console.error("productExtra is not a valid array.");
    }

    if (Array.isArray(productVariations)) {
      productVariations.forEach((variation, indexVar) => {
        // Validate and log variations to verify data integrity
        console.log(`Processing variation index ${indexVar}`, variation);

        /* Names */
        if (Array.isArray(variation.names)) {
          variation.names.forEach((name, index) => {
            // Log data for verification
            console.log(`Processing name at index ${index}:`, name);

            // Append formData fields for names
            formData.append(`variations[${indexVar}][names][${index}][name]`, name.name);
            formData.append(`variations[${indexVar}][names][${index}][tranlation_name]`, name.tranlation_name);
            formData.append(`variations[${indexVar}][names][${index}][tranlation_id]`, name.tranlation_id);
          });
        } else {
          console.warn(`variation.names is not a valid array for variation index ${indexVar}`);
        }

        if (Array.isArray(variation.options)) {
          variation.options.forEach((option, indexOption) => {
            // Extra Option Handling
            if (Array.isArray(option.extra)) {
              option.extra.forEach((extraOption, indexExtra) => {
                // Append extra_index and extra_price directly
                formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_index]`, 
                  extraOption.extra_index !== undefined ? String(extraOption.extra_index) : '');
                
                formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_price]`, 
                  extraOption.extra_price || '0');
              });
            }
        
            // Names Option Handling (unchanged as it's separate from extras)
            if (Array.isArray(option.names) && option.names.length > 0) {
              option.names.forEach((optionNa, indexOpNa) => {
                formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`, 
                  optionNa.name && typeof optionNa.name === 'string' ? optionNa.name : '');
                
                formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_id]`,
                  optionNa.tranlation_id !== undefined ? String(optionNa.tranlation_id) : '');
                
                formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_name]`,
                  typeof optionNa.tranlation_name === 'string' ? optionNa.tranlation_name : '');
              });
            }
        
            // Append other option-specific data
            formData.append(`variations[${indexVar}][options][${indexOption}][price]`, option.price ||0);
            formData.append(`variations[${indexVar}][options][${indexOption}][status]`, option.status);
            formData.append(`variations[${indexVar}][options][${indexOption}][points]`, option.points ||0);
          });
        }
        // Append general variation data
        formData.append(`variations[${indexVar}][type]`, variation.type);
        formData.append(`variations[${indexVar}][min]`, variation.min);
        formData.append(`variations[${indexVar}][max]`, variation.max);
        formData.append(`variations[${indexVar}][required]`, variation.required ? 1 : 0); // Convert boolean to 1/0
      });
    } else {
      console.error("productVariations is not a valid array.");
    }


    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }



    postData(formData, 'Product Added Success')

  };

  useEffect(() => {
    if (response && response.status === 200) {
      handleReset();
    }
    console.log('response', response)
  }, [response]);


  return (
    <>
      {loadingTranslation || loadingCategory || loadingProduct || loadingPost ? (
        <>
          <div className="w-full flex justify-center items-center">
            <LoaderLogin />
          </div>
        </>
      ) : (

        <form onSubmit={handleproductAdd} className='w-full flex flex-col items-center justify-center pb-24 gap-5'>
          <div className="w-full flex flex-col items-start justify-start gap-5">

            {/* Product Names && Description */}
            <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

              <div className="w-full flex items-center justify-start gap-x-6">
                {taps.map((tap, index) => (
                  <span
                    key={tap.id}
                    onClick={() => handleProductNamesTap(index)}
                    className={`${currentProductNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                  >
                    {tap.name}
                  </span>

                ))}
              </div>

              <div className="w-full">
                {taps.map((tap, index) => (
                  currentProductNamesTap === index && (
                    <div
                      className="w-full flex sm:flex-col lg:flex-row items-center justify-start gap-4"
                      key={tap.id}
                    >
                      {/* Product Name Input */}
                      <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                        <span className="text-xl font-TextFontRegular text-thirdColor">Product Name {tap.name}:</span>
                        <TextInput
                          value={productNames[index]?.product_name} // Access category_name property
                          onChange={(e) => {
                            const inputValue = e.target.value; // Ensure this is a string
                            setProductNames(prev => {
                              const updatedProductNames = [...prev];

                              // Ensure the array is long enough
                              if (updatedProductNames.length <= index) {
                                updatedProductNames.length = index + 1; // Resize array
                              }

                              // Create or update the object at the current index
                              updatedProductNames[index] = {
                                ...updatedProductNames[index], // Retain existing properties if any
                                'tranlation_id': tap.id, // Use the ID from tap
                                'product_name': inputValue, // Use the captured string value
                                'tranlation_name': tap.name || 'Default Name', // Use tap.name for tranlation_name
                              };

                              return updatedProductNames;
                            });
                          }}
                          placeholder="Product Name"
                        />
                      </div>

                      {/* Product Description Input */}
                      <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                        <span className="text-xl font-TextFontRegular text-thirdColor">Product Description {tap.name}:</span>
                        <TextInput
                          value={descriptionNames[index]?.description_name} // Access category_name property
                          onChange={(e) => {
                            const inputValue = e.target.value; // Ensure this is a string
                            setDescriptionNames(prev => {
                              const updatedDescriptionNames = [...prev];

                              // Ensure the array is long enough
                              if (updatedDescriptionNames.length <= index) {
                                updatedDescriptionNames.length = index + 1; // Resize array
                              }

                              // Create or update the object at the current index
                              updatedDescriptionNames[index] = {
                                ...updatedDescriptionNames[index], // Retain existing properties if any
                                'tranlation_id': tap.id, // Use the ID from tap
                                'description_name': inputValue, // Use the captured string value
                                'tranlation_name': tap.name || 'Default Name', // Use tap.name for tranlation_name
                              };

                              return updatedDescriptionNames;
                            });
                          }}
                          placeholder="Product Description"
                        />
                      </div>

                      {/* Conditional Rendering for First Tab Only */}
                    </div>
                  )
                ))}


              </div>

            </div>

            {/* Product Details */}

            {/* More Details */}
            <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start  gap-5">
              {/* Product Category  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Category Name:</span>
                <DropDown
                  ref={categoryRef}
                  handleOpen={handleOpenCategory}
                  stateoption={selectedCategoryState}
                  openMenu={isOPenProductCategory}
                  handleOpenOption={handleOpenOptionProductCategory}
                  options={categories}
                  onSelectOption={handleSelectProductCategory}
                />
              </div>
              {/* Product SubCategory  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">SubCategory Name:</span>
                <DropDown
                  ref={subCategoryRef}
                  handleOpen={handleOpenSubCategory}
                  stateoption={selectedSubCategoryState}
                  openMenu={isOPenProductSubCategory}
                  handleOpenOption={handleOpenOptionProductSubCategory}
                  options={filterSubCategories}
                  onSelectOption={handleSelectProductSubCategory}
                />
              </div>
              {/* Product Addons  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Addons Names:</span>
                <MultiSelect
                  value={selectedAddonsId}
                  onChange={(e) => setSelectedAddonsId(e.value)} // Assigns entire selected array
                  options={addons}
                  optionLabel="name"
                  display="chip"
                  placeholder={selectedAddonsState}
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem bg-white shadow"
                />
              </div>
            </div>

            <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-5">
              {/* Product Item Type  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Item Type:</span>
                <DropDown
                  ref={itemTypeRef}
                  handleOpen={handleOpenItemType}
                  stateoption={selectedItemTypeState}
                  openMenu={isOPenProductItemType}
                  handleOpenOption={handleOpenOptionProductItemType}
                  options={itemTypes}
                  onSelectOption={handleSelectProductItemType}
                />
              </div>
              {/* Product Stock Type  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Stock Type:</span>
                <DropDown
                  ref={stockTypeRef}
                  handleOpen={handleOpenStockType}
                  stateoption={selectedStockTypeState}
                  openMenu={isOPenProductStockType}
                  handleOpenOption={handleOpenOptionProductStockType}
                  options={stockTypes}
                  onSelectOption={handleSelectProductStockType}
                />
              </div>

              {selectedStockTypeName === 'daily' || selectedStockTypeName === 'fixed' ? (
                <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">Number:</span>
                  <NumberInput
                    value={productStockNumber}
                    onChange={(e) => setProductStockNumber(e.target.value)}
                    placeholder={'Number'}
                  />
                </div>
              ) : ('')}

              {/* Product Price */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Price:</span>
                <NumberInput
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder={'Price'}
                />
              </div>
            </div>

            <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-5">
              {/* Product Discount  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Discount Name:</span>
                <DropDown
                  ref={discountRef}
                  handleOpen={handleOpenDiscount}
                  stateoption={selectedDiscountState}
                  openMenu={isOPenProductDiscount}
                  handleOpenOption={handleOpenOptionProductDiscount}
                  options={discounts}
                  onSelectOption={handleSelectProductDiscount}
                />
              </div>
              {/* Product Tax  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Tax Name:</span>
                <DropDown
                  ref={taxRef}
                  handleOpen={handleOpenTax}
                  stateoption={selectedTaxState}
                  openMenu={isOPenProductTax}
                  handleOpenOption={handleOpenOptionProductTax}
                  options={taxes}
                  onSelectOption={handleSelectProductTax}
                />
              </div>
              {/* Product Point */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
                <NumberInput
                  value={productPoint}
                  onChange={(e) => setProductPoint(e.target.value)}
                  placeholder={'Point'}
                />
              </div>
            </div>

            <div className="w-full flex sm:flex-col lg:flex-row items-start justify-start mt-2 gap-5">
              {/* Product Image */}
              {/* <div className="sm:w-full lg:w-[33%]  sm:flex-col lg:flex-row flex sm:items-start lg:items-center justify-start gap-x-3"> */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">Product Image:</span>
                <UploadInput
                  value={productImageName}
                  uploadFileRef={productImageRef}
                  placeholder="Product Image"
                  handleFileChange={handleProductImageChange}
                  onChange={(e) => setProductImage(e.target.value)}
                  onClick={() => handleProductImageClick(productImageRef)}
                />
              </div>

              {productTimeStatus === 1 && (
                <>

                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">From:</span>
                    <TimeInput
                      value={productStatusFrom ?? ''}
                      onChange={(e) => setProductStatusFrom(e.target.value)}
                    />
                    {/* <input type="time" /> */}
                  </div>

                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">To:</span>
                    <TimeInput
                      value={productStatusTo ?? ''}
                      onChange={(e) => setProductStatusTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-4">

              {/* Product Status */}
              <div className='sm:w-full lg:w-[20%] flex items-center justify-start gap-x-3'>
                <span className="text-xl font-TextFontRegular text-thirdColor">Status:</span>
                <Switch handleClick={handleProductStatus} checked={productStatus} />
              </div>
              {/* Product Product Recommended */}
              <div className='sm:w-full lg:w-[40%] flex items-center justify-start gap-x-3'>
                <span className="text-xl font-TextFontRegular text-thirdColor">Product Recommended:</span>
                <Switch handleClick={handleProductRecommended} checked={productRecommended} />
              </div>
              {/* Product Time Status */}
              <div className='sm:w-full lg:w-[35%] flex items-center justify-start gap-x-3'>
                <span className="text-xl font-TextFontRegular text-thirdColor">Product Time Status:</span>
                <Switch handleClick={handleProductTimeStatus} checked={productTimeStatus} />
              </div>

            </div>

            {/* Exclude Names */}
            <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

              {productExclude.length !== 0 && (


                <div className="w-full flex items-center justify-start gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleExcludeNamesTap(index)}
                      className={`${currentExcludeNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                    >
                      {tap.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-full">
                {taps.map((tap, index) => (
                  currentExcludeNamesTap === index && (
                    <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
                      {(productExclude || []).map((ele, indexMap) => (
                        <div
                          className="w-full flex items-center justify-start gap-5"
                          key={`${tap.id}-${indexMap}`}
                        >
                          {/* Exclude Name Input */}
                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                            <span className="text-xl font-TextFontRegular text-thirdColor">
                              Exclude Name {tap.name}:
                            </span>
                            <TextInput
                              value={ele.names.find(name => name.tranlation_name === tap.name)?.exclude_name}
                              onChange={(e) => {
                                const updatedValue = e.target.value;
                                setProductExclude((prevProductExclude) =>
                                  prevProductExclude.map((item, idx) =>
                                    idx === indexMap
                                      ? {
                                        ...item,
                                        names: item.names.map((name) =>
                                          name.tranlation_name === tap.name
                                            ? { ...name, exclude_name: updatedValue }
                                            : name
                                        ),
                                      }
                                      : item
                                  )
                                );
                              }}
                              placeholder="Exclude Name"
                            />
                          </div>

                          {/* Remove Button */}
                          {index === 0 && (
                            <div className="flex items-end mt-10">
                              <StaticButton
                                text="Remove"
                                handleClick={() => handleRemoveExclude(indexMap)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      {index === 0 && (
                        <div className={`w-full flex items-center ${productExclude.length === 0 ? 'justify-center' : 'justify-start'}`}>
                          <ButtonAdd
                            isWidth={true}
                            Color="mainColor"
                            Text={productExclude.length === 0 ? 'Add Exclude' : 'Add More Exclude'}
                            handleClick={handleAddExclude}
                          />
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>

            </div>

{/* Extra Names & Price */}
<div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">
  {productExtra.length !== 0 && (
    <div className="w-full flex items-center justify-start gap-x-6">
      {taps.map((tap, index) => (
        <span
          key={tap.id}
          onClick={() => handleExtraNamesTap(index)}
          className={`${currentExtraNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'} pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
        >
          {tap.name}
        </span>
      ))}
    </div>
  )}
  <div className="w-full">
    {taps.map((tap, index) => (
      currentExtraNamesTap === index && (
        <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
          {(productExtra || []).map((ele, indexMap) => (
            <div className="w-full flex items-center justify-start gap-5" key={`${tap.id}-${indexMap}`}>
              {/* Extra Name Input */}
              <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  Extra Name {tap.name}:
                </span>
                <TextInput
                  value={ele.names.find(name => name.tranlation_name === tap.name)?.extra_name}
                  onChange={(e) => handleExtraNameChange(indexMap, tap.name, e.target.value)}
                  placeholder="Extra Name"
                />
              </div>

              {/* Extra Price Input (shown for all languages but only editable in first) */}
              <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  Default Price:
                </span>
                {index === 0 ? (
                  <NumberInput
                    value={ele.extra_price}
                    onChange={(e) => handleExtraPriceChange(indexMap, e.target.value)}
                    placeholder="Default Price"
                  />
                ) : (
                  <NumberInput
                    value={ele.extra_price}
                    readOnly
                    placeholder="Default Price"
                  />
                )}
              </div>

              {/* Remove Button (only shown for first language) */}
              {index === 0 && (
                <div className="flex items-end mt-10">
                  <StaticButton
                    text="Remove"
                    handleClick={() => handleRemoveExtra(indexMap)}
                  />
                </div>
              )}
            </div>
          ))}
          {index === 0 && (
            <div className={`w-full flex items-center ${productExtra.length === 0 ? 'justify-center' : 'justify-start'}`}>
              <ButtonAdd
                isWidth={true}
                Color="mainColor"
                Text={productExtra.length === 0 ? 'Add Extra' : 'Add More Extra'}
                handleClick={handleAddExtra}
              />
            </div>
          )}
        </div>
      )
    ))}
  </div>
</div>

            {/* Product Variations */}
            <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">

              {productVariations.length !== 0 && (


                <div className="w-full flex items-center justify-start gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleVariationTap(index)}
                      className={`${currentVariationTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                    >
                      {tap.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-full">
                {taps.map((tap, index) => (
                  currentVariationTap === index && (
                    <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
                      {(productVariations || []).map((ele, indexVariation) => (
                        <div
                          className="w-full border-4 border-mainColor p-3 rounded-2xl  flex sm:flex-col lg:flex-row flex-wrap shadow  items-start justify-start gap-5"
                          key={`${tap.id}-${indexVariation}`}
                        >
                          {/* Variation Name */}
                          <div className="sm:w-full lg:w-[30%] flex sm:flex-col lg:flex-row items-start justify-start gap-5">
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                              <span className="text-xl font-TextFontRegular text-thirdColor">
                                Variation Name {tap.name}:
                              </span>
                              <TextInput
                                value={ele.names.find(name => name.tranlation_name === tap.name)?.name}
                                onChange={(e) => updateVariationState(setProductVariations, indexVariation, 'names', tap.name, e.target.value)}
                                placeholder="Variation Name"
                              />
                            </div>
                          </div>
                          {index === 0 && (
                            <>
                              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">Variation Type:</span>
                                <DropDown
                                  ref={(el) => (variationTypeRef.current[indexVariation] = el)} // Ensure correct indexing for refs
                                  handleOpen={() => handleOpenVariationType(indexVariation)} // Pass index of current variation
                                  stateoption={ele.type || 'Select Type'}
                                  openMenu={openVariationIndex === indexVariation} // Open only if index matches the open state
                                  handleOpenOption={handleOpenOptionProductVariationType}
                                  options={[{ name: 'single' }, { name: 'multiple' }]}
                                  onSelectOption={(option) => handleSelectProductVariationType(option, indexVariation)}
                                />
                              </div>

                              {ele.type === 'multiple' && (
                                <>
                                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">Min:</span>
                                    <NumberInput
                                      value={ele.min}  // Ensure `ele.points` has a default if undefined
                                      onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        setProductVariations((prevProductVariations) =>
                                          prevProductVariations.map((item, idx) =>
                                            idx === indexVariation
                                              ? {
                                                ...item,
                                                min: updatedValue, // Ensure this sets `points` correctly
                                              }
                                              : item
                                          )
                                        );
                                      }}
                                      placeholder={'Min'}
                                    />
                                  </div>

                                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">Max:</span>
                                    <NumberInput
                                      value={ele.max}  // Ensure `ele.points` has a default if undefined
                                      onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        setProductVariations((prevProductVariations) =>
                                          prevProductVariations.map((item, idx) =>
                                            idx === indexVariation
                                              ? {
                                                ...item,
                                                max: updatedValue, // Ensure this sets `points` correctly
                                              }
                                              : item
                                          )
                                        );
                                      }}
                                      placeholder={'Max'}
                                    />
                                  </div>
                                </>
                              )}

                              <div className='w-[32%] flex mt-10 items-center justify-center gap-x-3'>
                                <span className="text-xl font-TextFontRegular text-thirdColor">Required:</span>
                                <Switch
                                  handleClick={() => {
                                    setProductVariations((prevProductVariations) =>
                                      prevProductVariations.map((item, idx) =>
                                        idx === indexVariation
                                          ? {
                                            ...item,
                                            required: item.required === 1 ? 0 : 1,  // Toggle between 1 and 0
                                          }
                                          : item
                                      )
                                    );
                                  }}
                                  checked={ele.required === 1}  // Consider it checked if `required` is 1
                                />

                              </div>
                              <div className="w-full">
                                <TitlePage text={'Options Variation'} />
                              </div>
                            </>
                          )}


                          {index === 0 && (
                            <>
                              {/* Options */}
                              <div className="w-full flex items-center justify-start gap-x-6">
                                {/* Tabs for variation options */}
                                {taps.map((tap, index) => (
                                  <span
                                    key={tap.id}
                                    onClick={() => handleVariationOptionTap(index)}
                                    className={`${currentVariationOptionTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'} 
                  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                                  >
                                    {tap.name}
                                  </span>
                                ))}
                              </div>

                              {/* Render each variation's options */}
                              {taps.map((tapOption, indexOptionTap) => (
                                currentVariationOptionTap === indexOptionTap && (
                                  <div className="w-full flex flex-col items-start justify-start gap-4" key={tapOption.id}>
                                    <div className="sm:w-full flex flex-wrap items-start justify-start gap-5">
                                      {/* Render options */}
                                      {ele.options.map((option, indexOption) => (
                                        <div className="sm:w-full flex flex-wrap items-start justify-start gap-5 shadow-md p-5 pt-0 rounded-xl" key={`${indexOption}-${tapOption.id}`}>
                                          {/* Option Name */}
                                          <div className="w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                            <span className="text-xl font-TextFontRegular text-thirdColor">
                                              Option Name {tapOption.name}:
                                            </span>
                                            <TextInput
                                              value={
                                                option.names.find(nameObj => nameObj.tranlation_name === tapOption.name)?.name
                                              }
                                              onChange={(e) => {
                                                const updatedValue = e.target.value;
                                                setProductVariations((prevVariations) =>
                                                  prevVariations.map((variation, idx) =>
                                                    idx === indexVariation
                                                      ? {
                                                        ...variation,
                                                        options: variation.options.map((opt, optIdx) =>
                                                          optIdx === indexOption
                                                            ? {
                                                              ...opt,
                                                              names: opt.names.map((nameObj) =>
                                                                nameObj.tranlation_name === tapOption.name
                                                                  ? { ...nameObj, name: updatedValue }
                                                                  : nameObj
                                                              ),
                                                            }
                                                            : opt
                                                        ),
                                                      }
                                                      : variation
                                                  )
                                                );
                                              }}
                                              placeholder="Option Name"
                                            />
                                          </div>
                                          {indexOptionTap === 0 && (
                                            <>
                                              {/* Option Price */}
                                              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-xl font-TextFontRegular text-thirdColor">Price:</span>
                                                <NumberInput
                                                  value={option.price}
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value;
                                                    setProductVariations((prevProductVariations) =>
                                                      prevProductVariations.map((item, idx) =>
                                                        idx === indexVariation
                                                          ? {
                                                            ...item,
                                                            options: item.options.map((opt, optIdx) =>
                                                              optIdx === indexOption
                                                                ? { ...opt, price: updatedValue }
                                                                : opt
                                                            ),
                                                          }
                                                          : item
                                                      )
                                                    );
                                                  }}
                                                  placeholder="Price"
                                                />
                                              </div>
                                              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
                                                <NumberInput
                                                  value={option.points}  // Ensure `ele.points` has a default if undefined
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value;
                                                    setProductVariations((prevProductVariations) =>
                                                      prevProductVariations.map((item, idx) =>
                                                        idx === indexVariation
                                                          ? {
                                                            ...item,
                                                            options: item.options.map((opt, optIdx) =>
                                                              optIdx === indexOption
                                                                ? { ...opt, points: updatedValue }
                                                                : opt
                                                            ),
                                                          }
                                                          : item
                                                      )
                                                    );
                                                  }}
                                                  placeholder={'Point'}
                                                />
                                              </div>

                                              {/* Option Status */}
                                              <div className="w-[20%] flex items-center justify-start gap-x-3 lg:mt-3">
                                                <span className="text-xl font-TextFontRegular text-thirdColor">Status:</span>
                                                <Switch
                                                  handleClick={() =>
                                                    setProductVariations((prevProductVariations) =>
                                                      prevProductVariations.map((item, idx) =>
                                                        idx === indexVariation
                                                          ? {
                                                            ...item,
                                                            options: item.options.map((opt, optIdx) =>
                                                              optIdx === indexOption
                                                                ? { ...opt, status: opt.status ? 0 : 1 }
                                                                : opt
                                                            ),
                                                          }
                                                          : item
                                                      )
                                                    )
                                                  }
                                                  checked={option.status === 1}
                                                />
                                              </div>

                                            </>
                                          )}


                                        {/* Inside the variation options section */}
{/* Inside variation options */}
{option.extra.map((extra, extraIndex) => {
  // Only show in first language tab (indexOptionTap === 0)
  if (indexOptionTap !== 0) return null;

  const selectedExtra = productExtra.find(ex => ex.extra_index === extra.extra_index);
  const defaultPrice = selectedExtra?.extra_price || '';

  return (
    <div className="w-full flex flex-wrap items-start justify-start gap-5" key={`${tapOption.id}-${indexOption}-${extraIndex}`}>
      {/* Extra Selection Dropdown */}
      <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
        <span className="text-xl font-TextFontRegular text-thirdColor">
          Select Extra:
        </span>
        <DropDown
          ref={(el) => (extraDropdownRef.current[`${indexVariation}-${indexOption}-${extraIndex}`] = el)}
          handleOpen={() => handleOpenExtraDropdown(indexVariation, indexOption, extraIndex)}
          stateoption={selectedExtra ? 
            selectedExtra.names[0]?.extra_name || `Extra ${extra.extra_index + 1}` : 
            'Select Extra'}
          openMenu={openExtraDropdown === `${indexVariation}-${indexOption}-${extraIndex}`}
          options={productExtra
            .filter(ex => 
              // Show if not used in other extras or is the current selection
              !option.extra.some(e => e.extra_index === ex.extra_index && e !== extra) || 
              ex.extra_index === extra.extra_index
            )
            .map(ex => ({ 
              name: ex.names.find(n => n.tranlation_name === taps[0].name)?.extra_name || `Extra ${ex.extra_index + 1}`,
              value: ex.extra_index 
            }))}
          onSelectOption={(selected) => {
            const selectedExtra = productExtra.find(ex => ex.extra_index === selected.value);
            if (selectedExtra) {
              setProductVariations(prev => 
                prev.map((variation, vIdx) =>
                  vIdx === indexVariation
                    ? {
                        ...variation,
                        options: variation.options.map((opt, oIdx) =>
                          oIdx === indexOption
                            ? {
                                ...opt,
                                extra: opt.extra.map((ext, eIdx) =>
                                  eIdx === extraIndex
                                    ? {
                                        ...ext,
                                        extra_index: selectedExtra.extra_index,
                                        extra_price: selectedExtra.extra_price, // Set default price initially
                                        extra_names: selectedExtra.names
                                      }
                                    : ext
                                )
                              }
                            : opt
                        )
                      }
                    : variation
                )
              );
            }
          }}
        />
      </div>

      {/* Override Price Input */}
      <div className="sm:w-full lg:w-[20%] flex flex-col items-start justify-center gap-y-1">
        <span className="text-xl font-TextFontRegular text-thirdColor">
          Override Price:
        </span>
        <NumberInput
          value={extra.extra_price}
          onChange={(e) => handleExtraPriceOverride(indexVariation, indexOption, extraIndex, e.target.value)}
          placeholder="Override Price"
        />
      </div>

      {/* Remove Extra Button */}
      <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
        <StaticButton
          text="Remove Extra"
          handleClick={() => handleRemoveExtraAtOption(indexVariation, indexOption, extraIndex)}
        />
      </div>
    </div>
  );
})}
                                          {/* Add Extra Button */}
                                          <div className="sm:w-full flex items-center justify-center">
                                            <ButtonAdd
                                              isWidth={true}
                                              Color="mainColor"
                                              Text="Add Extra"
                                              handleClick={() => handleAddExtraAtOption(indexVariation, indexOption)}
                                            />
                                          </div>
                                          {ele.options.length > 1 && (

                                            <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
                                              <StaticButton
                                                text="Remove option"
                                                handleClick={() =>
                                                  handleRemoveOption(indexVariation, indexOption)
                                                }
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              ))}



                              <div className="w-full flex flex-col gap-y-3">

                                <div className='sm:w-full flex items-center justify-center'>
                                  <ButtonAdd
                                    isWidth={true}
                                    Color="mainColor"
                                    Text={'Add Option'}
                                    handleClick={() => handleAddOption(indexVariation)}
                                  />
                                </div>

                                <div className='sm:w-full flex items-center justify-end'>
                                  <div className='sm:w-full lg:w-auto'>
                                    <StaticButton
                                      text={'Remove Variation'}
                                      handleClick={() => handleRemoveVariation(indexVariation)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                        </div>
                      ))}
                      {index === 0 && (
                        <div className={`w-full flex items-center ${productVariations.length === 0 ? 'justify-center' : 'justify-start'}`}>
                          <ButtonAdd
                            isWidth={true}
                            Color="mainColor"
                            Text={productVariations.length === 0 ? 'Add Variation' : 'Add More Variation'}
                            handleClick={handleAddVariation}
                          />
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>

            </div>

          </div>


          {/* Buttons*/}
          <div className="w-full flex items-center justify-end gap-x-4">
            <div>
              <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
            </div>
            <div>
              <SubmitButton
                text={'Add Product'}
                rounded='rounded-full'
                handleClick={handleproductAdd}
              />
            </div>

          </div>

        </form>
      )}
    </>
  )
}

export default AddProductPage