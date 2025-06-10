import React, { useEffect, useRef, useState } from "react";
import { useGet } from "../../../../Hooks/useGet";
import {
  DropDown,
  LoaderLogin,
  NumberInput,
  StaticButton,
  SubmitButton,
  Switch,
  TextInput,
  TimeInput,
  TitlePage,
  UploadInput,
} from "../../../../Components/Components";
import { usePost } from "../../../../Hooks/usePostJson";
import { MultiSelect } from "primereact/multiselect";
import ButtonAdd from "../../../../Components/Buttons/AddButton";
import { useAuth } from "../../../../Context/Auth";
import { replace, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  /* Get Data */
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchProductEdit,
    loading: loadingProductEdit,
    data: dataProductEdit,
  } = useGet({ url: `${apiUrl}/admin/product/item/${productId}` });

  const {
    refetch: refetchTranslation,
    loading: loadingTranslation,
    data: dataTranslation,
  } = useGet({
    url: `${apiUrl}/admin/translation`,
  });
  const {
    refetch: refetchCategory,
    loading: loadingCategory,
    data: dataCategory,
  } = useGet({ url: `${apiUrl}/admin/category` });
  const {
    refetch: refetchProduct,
    loading: loadingProduct,
    data: dataProduct,
  } = useGet({
    url: `${apiUrl}/admin/product`,
  });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/product/update/${productId}`,
  });
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
  const [taps, setTaps] = useState([]);
  const [currentProductNamesTap, setCurrentProductNamesTap] = useState(0);
  const [currentExcludeNamesTap, setCurrentExcludeNamesTap] = useState(0);
  const [currentExtraNamesTap, setCurrentExtraNamesTap] = useState(0);
  const [currentVariationTap, setCurrentVariationTap] = useState(0);
  const [currentVariationOptionTap, setCurrentVariationOptionTap] = useState(0);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterSubCategories, setFilterSubCategories] = useState([]);
  const [addons, setAddons] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [taxes, setTaxes] = useState([]);

   const [itemTypes, setItemTypes] = useState([
     { id: "", name: t("Selected Item Type") },
     { id: "online", name: t("online") },
     { id: "offline", name: t("offline") },
     { id: "all", name: t("all") },
   ]);
  const [stockTypes, setStockTypes] = useState([
    { id: "", name: t("Selected Stock Type") },
    { id: "unlimited", name: t("unlimited") },
    { id: "daily", name: t("daily") },
    { id: "fixed", name: t("fixed") },
  ]);

  /*  */
  const [productEdit, setProductEdit] = useState([]);
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
  const [selectedCategoryState, setSelectedCategoryState] =
    useState(t("Selected Category"));
  // const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Product SubCategory
  const [selectedSubCategoryState, setSelectedSubCategoryState] = useState(
    t("Selected Subcategory")
  );
  // const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  // Product Discount
  const [selectedDiscountState, setSelectedDiscountState] =
    useState(t("Selected Discount"));
  // const [selectedDiscountName, setSelectedDiscountName] = useState('')
  const [selectedDiscountId, setSelectedDiscountId] = useState("");

  // Product Tax
  const [selectedTaxState, setSelectedTaxState] = useState("Selected Tax");
  // const [selectedTaxName, setSelectedTaxName] = useState('')
  const [selectedTaxId, setSelectedTaxId] = useState("");

  // Product Addons
  const [selectedAddonsState, setSelectedAddonsState] =
    useState(t("Selected Addons"));
  const [selectedAddonsObjects, setSelectedAddonsObjects] = useState([]);
  const [selectedAddonsId, setSelectedAddonsId] = useState([]);

  // Product Item Types
  const [selectedItemTypeState, setSelectedItemTypeState] =
    useState(t("Selected Item Type"));
  const [selectedItemTypeName, setSelectedItemTypeName] = useState("");

  // Product Stock Types
  const [selectedStockTypeState, setSelectedStockTypeState] = useState(
    t("Selected Stock Type")
  );
  const [selectedStockTypeName, setSelectedStockTypeName] = useState("");
  // Product Stock Number
  const [productStockNumber, setProductStockNumber] = useState("");

  // Product Price && Point
  const [productPrice, setProductPrice] = useState("");
  const [productPoint, setProductPoint] = useState("");

  // Product From && To Status
  const [productStatusFrom, setProductStatusFrom] = useState("");
  const [productStatusTo, setProductStatusTo] = useState("");

  // Product Status && Recommended && Time Status
  const [productStatus, setProductStatus] = useState(0);
  const [productRecommended, setProductRecommended] = useState(0);
  const [productTimeStatus, setProductTimeStatus] = useState(0);

  // Product Image
  const [productImage, setProductImage] = useState(null);
  const [productImageName, setProductImageName] = useState(t("Choose Photo"));
  /* dropdown Status */
  const [isOPenProductCategory, setIsOPenProductCategory] = useState(false);
  const [isOPenProductSubCategory, setIsOPenProductSubCategory] =
    useState(false);
  const [isOPenProductItemType, setIsOPenProductItemType] = useState(false);
  const [isOPenProductStockType, setIsOPenProductStockType] = useState(false);
  const [isOPenProductDiscount, setIsOPenProductDiscount] = useState(false);
  const [isOPenProductTax, setIsOPenProductTax] = useState(false);

  /* Refetch Data */
  useEffect(() => {
    refetchProductEdit(); // Get Product Edit data when the component mounts

    refetchTranslation(); // Get Language Translation data when the component mounts
    refetchCategory(); // Get Categories && Addons && SubCategories data when the component mounts
    refetchProduct(); // Get Discounts && Taxes data when the component mounts
  }, [refetchProductEdit, refetchTranslation, refetchCategory, refetchProduct]);

  useEffect(() => {
    /* Set data to Taps Languages Translation */
    if (dataTranslation) {
      setTaps(dataTranslation?.translation || []); // Update taps if dataTranslation exists
    }
    /* Set data to Categories && Addons && SubCategories */
   setCategories([
  { id: "", name: t("Select Category") },
  ...(dataCategory?.parent_categories || []),
]);

setSubCategories([
  { id: "", name: t("Select Subcategory") },
  ...(dataCategory?.sub_categories || []),
]);

setDiscounts([
  { id: "", name: t("Select Discount") },
  ...(dataProduct?.discounts || []),
]);

setTaxes([
  { id: "", name: t("Select Tax") },
  ...(dataProduct?.taxes || []),
]);

    if (dataProductEdit) {
      setProductEdit(dataProductEdit?.product || []);
    }
    /* Log Data */

    console.log("dataTranslation", dataTranslation);
    console.log("dataCategory", dataCategory);
    console.log("dataProduct", dataProduct);
    console.log("ProductExclude", productExclude);
  }, [dataTranslation, dataCategory, dataProduct]);

  useEffect(() => {
    console.log("selectedAddonsId", selectedAddonsId);
  }, [selectedAddonsId]);

  useEffect(() => {
    if (productEdit) {
      setProductNames(productEdit?.product_names || []);
      setDescriptionNames(productEdit?.product_descriptions || []);
      setProductExclude(productEdit?.exclude || []);

      // Handle description data
      const formattedDescription =
        productEdit?.product_descriptions?.map((description) => ({
          description_name: description.product_description,
          tranlation_id: description.tranlation_id,
          tranlation_name: description.tranlation_name,
        })) || [];

      setDescriptionNames(formattedDescription);

      // Handle extras data
      const formattedExtras =
        productEdit?.extras?.map((extra) => ({
          names:
            extra.names?.map((name) => ({
              extra_name: name.extra_name,
              tranlation_id: name.tranlation_id,
              tranlation_name: name.tranlation_name,
            })) || [],
          extra_price: extra.extra_price || "",
          extra_index: extra.extra_index, // Add index if available
        })) || [];
      setProductExtra(formattedExtras);

      // Handle variations data
      const formattedVariations =
        productEdit?.variation?.map((variation) => ({
          id: variation.id, // Preserve variation ID if exists
          type: variation.type || "single",
          required: variation.required || 0,
          min: variation.min || "",
          max: variation.max || "",
          names:
            variation.names?.map((name) => ({
              name: name.name,
              tranlation_id: name.tranlation_id,
              tranlation_name: name.tranlation_name,
            })) || [],
          options:
            variation.options?.map((option) => ({
              id: option.id, // Preserve option ID if exists
              names:
                option.names?.map((name) => ({
                  name: name.name,
                  tranlation_id: name.tranlation_id,
                  tranlation_name: name.tranlation_name,
                })) || [],
              extra:
                option.extra?.map((extraItem) => ({
                  extra_index: extraItem.extra_index, // Link to extras array
                  extra_price: extraItem.extra_price || "",
                  extra_names: extraItem.extra_names || [], // Preserve names if available
                })) || [],
              points: option.points || "",
              price: option.price || "",
              status: option.status || 0,
            })) || [],
        })) || [];
      setProductVariations(formattedVariations);

      setSelectedAddonsId(productEdit?.addons || []);

      setSelectedCategoryId(productEdit?.category?.id || "");
      setSelectedCategoryState(
        productEdit?.category?.name || selectedCategoryState
      );

      setSelectedSubCategoryId(productEdit?.sub_category?.id || "");
      setSelectedSubCategoryState(
        productEdit?.sub_category?.name || selectedSubCategoryState
      );

      const filterSup = subCategories.filter(
        (sup) => sup.category_id === productEdit?.category?.id
      );
      setFilterSubCategories(
        [{ id: "", name: "Select Subcategory " }, ...filterSup] || []
      );

      setSelectedItemTypeName(productEdit?.item_type || "");
      setSelectedItemTypeState(productEdit?.item_type || selectedItemTypeState);

      setProductPrice(productEdit?.price || 0);
      setSelectedStockTypeState(
        productEdit?.stock_type || selectedStockTypeState
      );
      setSelectedStockTypeName(productEdit?.stock_type || "");
      setProductStockNumber(productEdit?.number || "");

      setProductImage(productEdit?.image_link || "");
      setProductImageName(productEdit?.image_link || "");

      setSelectedDiscountId(productEdit?.discount?.id || "");
      setSelectedDiscountState(
        productEdit?.discount?.name || selectedDiscountState
      );
      setSelectedTaxId(productEdit?.tax?.id || "");
      setSelectedTaxState(productEdit?.tax?.name || selectedTaxState);

      setProductPoint(productEdit?.points || 0);

      setProductStatusFrom(productEdit?.from || "");
      setProductStatusTo(productEdit?.to || "");

      setProductStatus(productEdit?.status || 0);
      setProductTimeStatus(productEdit?.product_time_status || 0);
      setProductRecommended(productEdit?.recommended || 0);

      // setDescriptionNames(productEdit?.product_descriptions || [])
      console.log("productEdit?.points", productEdit?.points);
      console.log("productPoint", productPoint);
      console.log("productId", productId);
      console.log("dataProductEdit", productEdit);
      console.log("dataProductEdit", productEdit);
      console.log("ProductNames", productNames);
      console.log("DescriptionNames", descriptionNames);
      // console.log('ProductVariations', productVariations)
    }
  }, [productEdit, subCategories]);

  /* Handle Function */

  // Exclude Product
  const handleAddExclude = () => {
    const newExclude = {
      names: taps.map((tap) => ({
        exclude_name: "",
        tranlation_id: tap.id,
        tranlation_name: tap.name,
      })),
    };

    setProductExclude((prevProductnewExclude) => [
      ...prevProductnewExclude,
      newExclude,
    ]);
  };

  const handleRemoveExclude = (index) => {
    setProductExclude((prevProductExclude) =>
      prevProductExclude.filter((_, idx) => idx !== index)
    );
  };

  const handleRemoveExtra = (index) => {
    setProductExtra((prevProductExtra) =>
      prevProductExtra.filter((_, idx) => idx !== index)
    );
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
    console.log("ProductExclude", productExclude);
    console.log("ProductExtra", productExtra);
  }, [productExtra, productExclude]);

  // Add a new Variation
  const handleAddVariation = () => {
    const newVariation = {
      type: "",
      required: 0,
      min: "",
      max: "",
      names: taps.map((tap) => ({
        name: "",
        tranlation_id: tap.id,
        tranlation_name: tap.name,
      })),
      options: [
        {
          names: taps.map((tap) => ({
            name: "",
            tranlation_id: tap.id,
            tranlation_name: tap.name,
          })),
          extra: [
            {
              extra_names: taps.map((tap) => ({
                extra_name: "",
                tranlation_id: tap.id,
                tranlation_name: tap.name,
              })),
              extra_price: "",
            },
          ],
          points: "",
          price: "",
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
  const updateVariationState = (
    setProductVariations,
    variationIndex,
    field,
    tapName,
    updatedValue
  ) => {
    setProductVariations((prevProductVariations) =>
      prevProductVariations.map((item, idx) =>
        idx === variationIndex
          ? {
              ...item,
              [field]: item[field].map((subField) =>
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
        name: "",
        tranlation_id: tap.id,
        tranlation_name: tap.name,
      })),
      extra: [
        {
          extra_names: taps.map((tap) => ({
            extra_name: "",
            tranlation_id: tap.id,
            tranlation_name: tap.name,
          })),
          extra_price: "",
        },
      ],
      price: "",
      points: "",
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
    console.log("productVariations", productVariations);
  }, [productVariations]);

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
    handleCloseAllDropdowns();
    setIsOPenProductCategory(!isOPenProductCategory);
  };
  const handleOpenSubCategory = () => {
    handleCloseAllDropdowns();
    setIsOPenProductSubCategory(!isOPenProductSubCategory);
  };
  const handleOpenItemType = () => {
    handleCloseAllDropdowns();
    setIsOPenProductItemType(!isOPenProductItemType);
  };
  const handleOpenStockType = () => {
    handleCloseAllDropdowns();
    setIsOPenProductStockType(!isOPenProductStockType);
  };
  const handleOpenDiscount = () => {
    handleCloseAllDropdowns();
    setIsOPenProductDiscount(!isOPenProductDiscount);
  };
  const handleOpenTax = () => {
    handleCloseAllDropdowns();
    setIsOPenProductTax(!isOPenProductTax);
  };

  const handleOpenOptionProductCategory = () => setIsOPenProductCategory(false);
  const handleOpenOptionProductSubCategory = () =>
    setIsOPenProductSubCategory(false);
  const handleOpenOptionProductItemType = () => setIsOPenProductItemType(false);
  const handleOpenOptionProductStockType = () =>
    setIsOPenProductStockType(false);
  const handleOpenOptionProductDiscount = () => setIsOPenProductDiscount(false);
  const handleOpenOptionProductTax = () => setIsOPenProductTax(false);

  const handleSelectProductVariationType = (option, variationIndex) => {
    // Update the `type` of the variation at `variationIndex`
    setProductVariations((prevProductVariations) =>
      prevProductVariations.map((ele, index) =>
        index === variationIndex
          ? { ...ele, type: option.name, min: "", max: "" } // Update type with selected value
          : ele
      )
    );
  };

  const handleSelectProductCategory = (option) => {
    setSelectedCategoryId(option.id);
    setSelectedCategoryState(option.name);
    const filterSup = subCategories.filter(
      (sup) => sup.category_id === option.id
    );

    setFilterSubCategories([
      { id: "", name: "Selected Subcategory" },
      ...filterSup,
    ]);
    console.log("filterSup", filterSup);
  };
  const handleSelectProductSubCategory = (option) => {
    setSelectedSubCategoryId(option.id);
    setSelectedSubCategoryState(option.name);
  };
  const handleSelectProductItemType = (option) => {
    setSelectedItemTypeName(option.name);
    setSelectedItemTypeState(option.name);
  };
  const handleSelectProductStockType = (option) => {
    setSelectedStockTypeName(option.name);
    setSelectedStockTypeState(option.name);
    setProductStockNumber("");
  };
  const handleSelectProductDiscount = (option) => {
    setSelectedDiscountId(option.name);
    setSelectedDiscountState(option.name);
  };
  const handleSelectProductTax = (option) => {
    setSelectedTaxId(option.id);
    setSelectedTaxState(option.name);
  };

  const handleProductStatus = () => {
    const currentState = productStatus;
    {
      currentState === 0 ? setProductStatus(1) : setProductStatus(0);
    }
  };

  const handleProductRecommended = () => {
    const currentState = productRecommended;
    {
      currentState === 0 ? setProductRecommended(1) : setProductRecommended(0);
    }
  };

  const handleProductTimeStatus = () => {
    const currentState = productTimeStatus;
    {
      currentState === 0 ? setProductTimeStatus(1) : setProductTimeStatus(0);
    }
    setProductStatusFrom("");
    setProductStatusTo("");
  };

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
        categoryRef.current &&
        !categoryRef.current.contains(event.target) &&
        subCategoryRef.current &&
        !subCategoryRef.current.contains(event.target) &&
        itemTypeRef.current &&
        !itemTypeRef.current.contains(event.target) &&
        stockTypeRef.current &&
        !stockTypeRef.current.contains(event.target) &&
        discountRef.current &&
        !discountRef.current.contains(event.target) &&
        taxRef.current &&
        !taxRef.current.contains(event.target)
      ) {
        handleCloseAllDropdowns();
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    setIsOPenProductCategory,
    setIsOPenProductSubCategory,
    setIsOPenProductItemType,
    setIsOPenProductStockType,
    setIsOPenProductDiscount,
    setIsOPenProductTax,
    setOpenVariationIndex,
  ]);

  // Go To Languages Tap About Product Names
  const handleProductNamesTap = (index) => {
    setCurrentProductNamesTap(index);
  };
  // Go To Languages Tap About Exclude Names
  const handleExcludeNamesTap = (index) => {
    setCurrentExcludeNamesTap(index);
  };
  // Go To Languages Tap About Extra Names
  const handleExtraNamesTap = (index) => {
    setCurrentExtraNamesTap(index);
  };
  // Go To Languages Tap About Product Variation
  const handleVariationTap = (index) => {
    setCurrentVariationTap(index);
  };
  // Go To Languages Tap About Product Variation
  const handleVariationOptionTap = (index) => {
    setCurrentVariationOptionTap(index);
  };
  useEffect(() => {
    console.log("descriptionNames", descriptionNames);
  }, [descriptionNames]);
  /* Reset Details Product */
  const handleBack = () => {
    navigate(-1, { replace: true });
  };

  /* Reset Details Product */
  const handleReset = () => {
    console.log("productNames", productNames);
    console.log("descriptionNames", descriptionNames);

    setCurrentProductNamesTap(0);
    setCurrentExcludeNamesTap(0);
    setCurrentExtraNamesTap(0);
    setCurrentVariationTap(0);
    setCurrentVariationOptionTap(0);
    setProductNames([]);
    setDescriptionNames([]);
    setProductExclude([]);
    setProductExtra([]);
    setProductVariations([]);
    setSelectedCategoryState(t("Selected Category"));
    setSelectedCategoryId("");
    setSelectedSubCategoryState(t("Selected SubCategory"));
    setSelectedSubCategoryId("");
    setSelectedDiscountState(t("Selected Discount"));
    setSelectedDiscountId("");
    setSelectedTaxState(t("Selected Tax"));
    setSelectedTaxId("");
    setSelectedAddonsState(t("Selected Addons"));
    setSelectedAddonsId("");
    setSelectedItemTypeState(t("Selected Item Type"));
    setSelectedItemTypeName("");
    setSelectedStockTypeState(t("Selected Stock Type"));
    setSelectedStockTypeName("");
    setProductStockNumber("");
    setProductPrice("");
    setProductPoint("");
    setProductStatusFrom("");
    setProductStatusTo("");
    setProductStatus(0);
    setProductRecommended(0);
    setProductTimeStatus(0);
    setProductImage(null);
    setProductImageName(t("Choose Photo"));

    console.log("productExtra", productExtra);
  };

  // State for controlling extra dropdowns
  const [openExtraDropdown, setOpenExtraDropdown] = useState(null);
  const extraDropdownRef = useRef([]);

  const handleOpenExtraDropdown = (variationIndex, optionIndex, extraIndex) => {
    const key = `${variationIndex}-${optionIndex}-${extraIndex}`;
    setOpenExtraDropdown(openExtraDropdown === key ? null : key);
  };

  // Modify your handleAddExtra function to include extra_index
  const handleAddExtra = () => {
    setProductExtra((prev) => [
      ...prev,
      {
        names: taps.map((tap) => ({
          extra_name: "",
          tranlation_name: tap.name,
          tranlation_id: tap.id,
        })),
        extra_price: "",
        extra_index: prev.length, // This will be the index
      },
    ]);
  };
  // Modify your handleAddExtraAtOption function
  const handleAddExtraAtOption = (variationIndex, optionIndex) => {
    setProductVariations((prev) =>
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
                          extra_index:
                            productExtra.length === 1 ? 0 : undefined,
                          extra_price:
                            productExtra.length === 1
                              ? productExtra[0].extra_price
                              : "",
                          extra_names:
                            productExtra.length === 1
                              ? productExtra[0].names
                              : taps.map((tap) => ({
                                  extra_name: "",
                                  tranlation_name: tap.name,
                                  tranlation_id: tap.id,
                                })),
                        },
                      ],
                    }
                  : option
              ),
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
              options: variation.options.filter(
                (_, oIdx) => oIdx !== optionIndex
              ),
            }
          : variation
      )
    );
  };
  // Remove an Extra from a specific Option within a Variation
  const handleRemoveExtraAtOption = (
    variationIndex,
    optionIndex,
    extraIndex
  ) => {
    setProductVariations((prevVariations) =>
      prevVariations.map((variation, vIdx) =>
        vIdx === variationIndex
          ? {
              ...variation,
              options: variation.options.map((option, oIdx) =>
                oIdx === optionIndex
                  ? {
                      ...option,
                      extra: option.extra.filter(
                        (_, eIdx) => eIdx !== extraIndex
                      ),
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
    setProductExtra((prev) =>
      prev.map((item, idx) =>
        idx === indexMap
          ? {
              ...item,
              names: item.names.map((name) =>
                name.tranlation_name === language
                  ? { ...name, extra_name: value }
                  : name
              ),
            }
          : item
      )
    );
  };

  // Handle extra price change (in extras section)
  const handleExtraPriceChange = (indexMap, price) => {
    setProductExtra((prev) =>
      prev.map((item, idx) =>
        idx === indexMap ? { ...item, extra_price: price } : item
      )
    );
  };

  // Handle price override in variations
  const handleExtraPriceOverride = (
    variationIndex,
    optionIndex,
    extraIndex,
    price
  ) => {
    setProductVariations((prev) =>
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
                      ),
                    }
                  : option
              ),
            }
          : variation
      )
    );
  };

  /* Edit Product */
  const handleproductEdit = (e) => {
    e.preventDefault();

    // // Filter out any invalid or empty entries in product Names
    // const validProductNames = productNames.filter(
    //        (product) => product && product.tranlation_id && product.product_name && product.tranlation_name
    // );

    // if (validProductNames.length === 0) {
    //        auth.toastError('Please enter a product name');
    //        console.log('productNames', validProductNames);
    //        console.log('validProductNames.length', validProductNames.length);
    //        console.log('validProductNames', validProductNames)
    //        return;
    // }

    // if (validProductNames.length !== taps.length) {
    //        auth.toastError('Please enter all product names');
    //        console.log('productNames', validProductNames);
    //        console.log('taps.length', taps.length)
    //        console.log('validProductNames', validProductNames)
    //        return;
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
    //        auth.toastError('please Select Category Name')
    //        console.log('selectedCategoryId', selectedCategoryId)
    //        return;
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
    //        auth.toastError('please Enter Item Type')
    //        console.log('selectedItemTypeName', selectedItemTypeName)
    //        return;
    // }
    // if (!selectedStockTypeName) {
    //        auth.toastError('please Select Stock Type')
    //        console.log('selectedStockTypeName', selectedStockTypeName)
    //        return;
    // }
    // if (selectedStockTypeName === 'daily' || selectedStockTypeName === 'fixed') {
    //        if (!productStockNumber) {
    //               auth.toastError('please Enter Stock Number')
    //               console.log('productStockNumber', productStockNumber)
    //               return;
    //        }
    // }
    // if (!productPrice) {
    //        auth.toastError('please Enter Product Price')
    //        console.log('productPrice', productPrice)
    //        return;
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
    //        auth.toastError('please Set Product Image')
    //        console.log('productImage', productImage)
    //        return;
    // }

    // // if (productExclude.length === 0) {
    // //        auth.toastError('please Enter Exclude Name')
    // //        console.log('productExclude', productExclude)
    // //        return;
    // // }

    // // for (const ex of productExclude) {
    // //        for (const name of ex.names) {
    // //               if (!name.exclude_name || name.exclude_name.trim() === '') {
    // //                      auth.toastError('Please Enter All Exclude names');
    // //                      console.log('productExclude', productExclude)
    // //                      return;
    // //               }
    // //        }
    // // }

    // // Filter out any invalid or empty entries description Names
    // const validDescriptionNames = descriptionNames.filter(
    //        (desc) => desc && desc.tranlation_id && desc.product_description && desc.tranlation_name
    // );

    // // if (validDescriptionNames.length === 0) {
    // //        auth.toastError('Please enter a description name');
    // //        console.log('descriptionNames', validDescriptionNames);
    // //        return;
    // // }

    // // if (validDescriptionNames.length !== taps.length) {
    // //        auth.toastError('Please enter all description names');
    // //        console.log('descriptionNames', validDescriptionNames);
    // //        return;
    // // }

    const formData = new FormData();
    formData.append("category_id", selectedCategoryId);
    formData.append("sub_category_id", selectedSubCategoryId);
    formData.append("item_type", selectedItemTypeName);
    formData.append("stock_type", selectedStockTypeName);
    formData.append("number", productStockNumber);
    formData.append("price", productPrice);
    formData.append("discount_id", selectedDiscountId);
    formData.append("tax_id", selectedTaxId);
    formData.append("points", productPoint);

    formData.append("product_time_status", productTimeStatus);
    if (productStatusFrom) {
      formData.append("from", productStatusFrom);
    }
    if (productStatusTo) {
      formData.append("to", productStatusTo);
    }
    formData.append("recommended", productRecommended);
    formData.append("status", productStatus);
    formData.append("image", productImage);

    if (selectedAddonsId.length > 0) {
      const addonIds = selectedAddonsId.map((addon) => addon.id); // Extracts only the IDs

      addonIds.forEach((id, indexID) => {
        formData.append(`addons[${indexID}]`, id); // Appending each ID separately with 'addons[]'
      });
    }

    {
      productNames.forEach((name, index) => {
        formData.append(
          `product_names[${index}][product_name]`,
          name.product_name
        );
        formData.append(
          `product_names[${index}][tranlation_id]`,
          name.tranlation_id
        );
        formData.append(
          `product_names[${index}][tranlation_name]`,
          name.tranlation_name
        );
      });
    }

    {
      descriptionNames.forEach((name, index) => {
        formData.append(
          `product_descriptions[${index}][product_description]`,
          name.description_name
        );
        formData.append(
          `product_descriptions[${index}][tranlation_name]`,
          name.tranlation_name
        );
        formData.append(
          `product_descriptions[${index}][tranlation_id]`,
          name.tranlation_id
        );
      });
    }

    if (Array.isArray(productExclude)) {
      productExclude.forEach((exclude, index) => {
        if (Array.isArray(exclude.names)) {
          exclude.names.forEach((exName, exInd) => {
            formData.append(
              `excludes[${index}][names][${exInd}][exclude_name]`,
              exName.exclude_name
            );
            formData.append(
              `excludes[${index}][names][${exInd}][tranlation_id]`,
              exName.tranlation_id
            );
            formData.append(
              `excludes[${index}][names][${exInd}][tranlation_name]`,
              exName.tranlation_name
            );
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
            formData.append(
              `extra[${index}][names][${exInd}][extra_name]`,
              exName.extra_name
            );
            formData.append(
              `extra[${index}][names][${exInd}][tranlation_id]`,
              exName.tranlation_id
            );
            formData.append(
              `extra[${index}][names][${exInd}][tranlation_name]`,
              exName.tranlation_name
            );
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
            formData.append(
              `variations[${indexVar}][names][${index}][name]`,
              name.name
            );
            formData.append(
              `variations[${indexVar}][names][${index}][tranlation_name]`,
              name.tranlation_name
            );
            formData.append(
              `variations[${indexVar}][names][${index}][tranlation_id]`,
              name.tranlation_id
            );
          });
        } else {
          console.warn(
            `variation.names is not a valid array for variation index ${indexVar}`
          );
        }

        if (Array.isArray(variation.options)) {
          variation.options.forEach((option, indexOption) => {
            // Extra Option Handling
            if (Array.isArray(option.extra)) {
              option.extra.forEach((extraOption, indexExtra) => {
                // Append extra_index and extra_price directly
                formData.append(
                  `variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_index]`,
                  extraOption.extra_index !== undefined
                    ? String(extraOption.extra_index)
                    : ""
                );

                formData.append(
                  `variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_price]`,
                  extraOption.extra_price || "0"
                );
              });
            }

            // Names Option Handling (unchanged as it's separate from extras)
            if (Array.isArray(option.names) && option.names.length > 0) {
              option.names.forEach((optionNa, indexOpNa) => {
                formData.append(
                  `variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`,
                  optionNa.name && typeof optionNa.name === "string"
                    ? optionNa.name
                    : ""
                );

                formData.append(
                  `variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_id]`,
                  optionNa.tranlation_id !== undefined
                    ? String(optionNa.tranlation_id)
                    : ""
                );

                formData.append(
                  `variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_name]`,
                  typeof optionNa.tranlation_name === "string"
                    ? optionNa.tranlation_name
                    : ""
                );
              });
            }

            // Append other option-specific data
            formData.append(
              `variations[${indexVar}][options][${indexOption}][price]`,
              option.price || 0
            );
            formData.append(
              `variations[${indexVar}][options][${indexOption}][status]`,
              option.status
            );
            formData.append(
              `variations[${indexVar}][options][${indexOption}][points]`,
              option.points || 0
            );
          });
        }
        // Append general variation data
        formData.append(`variations[${indexVar}][type]`, variation.type);
        formData.append(`variations[${indexVar}][min]`, variation.min);
        formData.append(`variations[${indexVar}][max]`, variation.max);
        formData.append(
          `variations[${indexVar}][required]`,
          variation.required ? 1 : 0
        ); // Convert boolean to 1/0
      });
    } else {
      console.error("productVariations is not a valid array.");
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    postData(formData, "Product Edited Success");
  };

  useEffect(() => {
    if (response && response.status === 200) {
      //  handleBack();
    }
    console.log("response", response);
  }, [response]);

  return (
    <>
      {loadingTranslation ||
      loadingCategory ||
      loadingProduct ||
      loadingPost ? (
        <>
          <div className="flex items-center justify-center w-full">
            <LoaderLogin />
          </div>
        </>
      ) : (
        <form
          onSubmit={handleproductEdit}
          className="flex flex-col items-center justify-center w-full gap-5 pb-24"
        >
          <div className="flex flex-col items-start justify-start w-full gap-5">
            {/* Product Names && Description */}
            <div className="flex flex-col items-start justify-start w-full gap-4 pb-4 border-b-4 border-gray-300">
              <div className="flex items-center justify-start w-full gap-x-6">
                {taps.map((tap, index) => (
                  <span
                    key={tap.id}
                    onClick={() => handleProductNamesTap(index)}
                    className={`${
                      currentProductNamesTap === index
                        ? "text-mainColor border-b-4 border-mainColor"
                        : "text-thirdColor"
                    }  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                  >
                    {tap.name}
                  </span>
                ))}
              </div>

              <div className="w-full">
                {taps.map(
                  (tap, index) =>
                    currentProductNamesTap === index && (
                      <div
                        className="flex items-center justify-start w-full gap-4 sm:flex-col lg:flex-row"
                        key={tap.id}
                      >
                        {/* Product Name Input */}
                        <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">
                            {t("ProductName")} {tap.name}:
                          </span>
                          <TextInput
                            value={productNames[index]?.product_name} // Access category_name property
                            onChange={(e) => {
                              const inputValue = e.target.value; // Ensure this is a string
                              setProductNames((prev) => {
                                const updatedProductNames = [...prev];

                                // Ensure the array is long enough
                                if (updatedProductNames.length <= index) {
                                  updatedProductNames.length = index + 1; // Resize array
                                }

                                // Create or update the object at the current index
                                updatedProductNames[index] = {
                                  ...updatedProductNames[index], // Retain existing properties if any
                                  tranlation_id: tap.id, // Use the ID from tap
                                  product_name: inputValue, // Use the captured string value
                                  tranlation_name: tap.name || "Default Name", // Use tap.name for tranlation_name
                                };

                                return updatedProductNames;
                              });
                            }}
                            placeholder={t("Product Name")}
                          />
                        </div>

                        {/* Product Description Input */}
                        <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">
                            {t("Product Description")} {tap.name}:
                          </span>
                          <TextInput
                            value={descriptionNames[index]?.description_name} // Access category_name property
                            onChange={(e) => {
                              const inputValue = e.target.value; // Ensure this is a string
                              setDescriptionNames((prev) => {
                                const updatedDescriptionNames = [...prev];

                                // Ensure the array is long enough
                                if (updatedDescriptionNames.length <= index) {
                                  updatedDescriptionNames.length = index + 1; // Resize array
                                }

                                // Create or update the object at the current index
                                updatedDescriptionNames[index] = {
                                  ...updatedDescriptionNames[index], // Retain existing properties if any
                                  tranlation_id: tap.id, // Use the ID from tap
                                  description_name: inputValue, // Use the captured string value
                                  tranlation_name: tap.name || "Default Name", // Use tap.name for tranlation_name
                                };

                                return updatedDescriptionNames;
                              });
                            }}
                            placeholder={t("Product Description")}
                          />
                        </div>

                        {/* Conditional Rendering for First Tab Only */}
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Product Details */}

            {/* More Details */}
            <div className="flex items-start justify-start w-full gap-5 sm:flex-col lg:flex-row">
              {/* Product Category  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Category Name")}:
                </span>
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
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("SubCategory Name")}:
                </span>
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
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Addons Names")}:
                </span>
                <MultiSelect
                  value={selectedAddonsId}
                  onChange={(e) => setSelectedAddonsId(e.value)} // Assigns entire selected array
                  options={addons}
                  optionLabel="name"
                  display="chip"
                  placeholder={selectedAddonsState}
                  maxSelectedLabels={3}
                  className="w-full bg-white shadow md:w-20rem"
                />
              </div>
            </div>

            <div className="flex items-start justify-start w-full gap-5 sm:flex-col lg:flex-row">
              {/* Product Item Type  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Item Type")}:
                </span>
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
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Stock Type")}:
                </span>
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

              {selectedStockTypeName === "daily" ||
              selectedStockTypeName === "fixed" ? (
                <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("Number")}:
                  </span>
                  <NumberInput
                    value={productStockNumber}
                    onChange={(e) => setProductStockNumber(e.target.value)}
                    placeholder={t("Number")}
                  />
                </div>
              ) : (
                ""
              )}

              {/* Product Price */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Price")}:
                </span>
                <NumberInput
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder={t("Price")}
                />
              </div>
            </div>

            <div className="flex items-start justify-start w-full gap-5 sm:flex-col lg:flex-row">
              {/* Product Discount  */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Discount Name")}:
                </span>
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
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Tax Name")}:
                </span>
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
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Point")}:
                </span>
                <NumberInput
                  value={productPoint}
                  onChange={(e) => setProductPoint(e.target.value)}
                  placeholder={t("Point")}
                />
              </div>
            </div>

            <div className="flex items-start justify-start w-full gap-5 mt-2 sm:flex-col lg:flex-row">
              {/* Product Image */}
              {/* <div className="sm:w-full lg:w-[33%]  sm:flex-col lg:flex-row flex sm:items-start lg:items-center justify-start gap-x-3"> */}
              <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Product Image")}:
                </span>
                <UploadInput
                  value={productImageName}
                  uploadFileRef={productImageRef}
                  placeholder={t("Product Image")}
                  handleFileChange={handleProductImageChange}
                  onChange={(e) => setProductImage(e.target.value)}
                  onClick={() => handleProductImageClick(productImageRef)}
                />
              </div>

              {productTimeStatus === 1 && (
                <>
                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("From")}:
                    </span>
                    <TimeInput
                      value={productStatusFrom ?? ""}
                      onChange={(e) => setProductStatusFrom(e.target.value)}
                    />
                    {/* <input type="time" /> */}
                  </div>

                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("To")}:
                    </span>
                    <TimeInput
                      value={productStatusTo ?? ""}
                      onChange={(e) => setProductStatusTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start justify-start w-full gap-4 sm:flex-col lg:flex-row">
              {/* Product Status */}
              <div className="sm:w-full lg:w-[20%] flex items-center justify-start gap-x-3">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("Status")}:
                </span>
                <Switch
                  handleClick={handleProductStatus}
                  checked={productStatus}
                />
              </div>
              {/* Product Product Recommended */}
              <div className="sm:w-full lg:w-[40%] flex items-center justify-start gap-x-3">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("ProductRecommended")}:
                </span>
                <Switch
                  handleClick={handleProductRecommended}
                  checked={productRecommended}
                />
              </div>
              {/* Product Time Status */}
              <div className="sm:w-full lg:w-[35%] flex items-center justify-start gap-x-3">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("ProductTimeStatus")}:
                </span>
                <Switch
                  handleClick={handleProductTimeStatus}
                  checked={productTimeStatus}
                />
              </div>
            </div>

            {/* Exclude Names */}
            <div className="flex flex-col items-start justify-start w-full gap-4 pb-4 border-b-4 border-gray-300">
              {productExclude.length !== 0 && (
                <div className="flex items-center justify-start w-full gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleExcludeNamesTap(index)}
                      className={`${
                        currentExcludeNamesTap === index
                          ? "text-mainColor border-b-4 border-mainColor"
                          : "text-thirdColor"
                      }  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                    >
                      {tap.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-full">
                {taps.map(
                  (tap, index) =>
                    currentExcludeNamesTap === index && (
                      <div
                        className="flex flex-col items-center justify-center w-full gap-4"
                        key={tap.id}
                      >
                        {(productExclude || []).map((ele, indexMap) => (
                          <div
                            className="flex items-center justify-start w-full gap-5"
                            key={`${tap.id}-${indexMap}`}
                          >
                            {/* Exclude Name Input */}
                            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                              <span className="text-xl font-TextFontRegular text-thirdColor">
                                {t("ExcludeName")} {tap.name}:
                              </span>
                              <TextInput
                                value={
                                  ele.names.find(
                                    (name) => name.tranlation_name === tap.name
                                  )?.exclude_name
                                }
                                onChange={(e) => {
                                  const updatedValue = e.target.value;
                                  setProductExclude((prevProductExclude) =>
                                    prevProductExclude.map((item, idx) =>
                                      idx === indexMap
                                        ? {
                                            ...item,
                                            names: item.names.map((name) =>
                                              name.tranlation_name === tap.name
                                                ? {
                                                    ...name,
                                                    exclude_name: updatedValue,
                                                  }
                                                : name
                                            ),
                                          }
                                        : item
                                    )
                                  );
                                }}
                                placeholder={t("ExcludeName")}
                              />
                            </div>

                            {/* Remove Button */}
                            {index === 0 && (
                              <div className="flex items-end mt-10">
                                <StaticButton
                                  text={t("Remove")}
                                  handleClick={() =>
                                    handleRemoveExclude(indexMap)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        {index === 0 && (
                          <div
                            className={`w-full flex items-center ${
                              productExclude.length === 0
                                ? "justify-center"
                                : "justify-start"
                            }`}
                          >
                            <ButtonAdd
                              isWidth={true}
                              Color="mainColor"
                              Text={
                                productExclude.length === 0
                                  ? t("AddExclude")
                                  : t("AddMoreExclude")
                              }
                              handleClick={handleAddExclude}
                            />
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Extra Names & Price */}
            <div className="flex flex-col items-start justify-start w-full gap-4 pb-4 border-b-4 border-gray-300">
              {productExtra.length !== 0 && (
                <div className="flex items-center justify-start w-full gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleExtraNamesTap(index)}
                      className={`${
                        currentExtraNamesTap === index
                          ? "text-mainColor border-b-4 border-mainColor"
                          : "text-thirdColor"
                      } pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                    >
                      {tap.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-full">
                {taps.map(
                  (tap, index) =>
                    currentExtraNamesTap === index && (
                      <div
                        className="flex flex-col items-center justify-center w-full gap-4"
                        key={tap.id}
                      >
                        {(productExtra || []).map((ele, indexMap) => (
                          <div
                            className="flex items-center justify-start w-full gap-5"
                            key={`${tap.id}-${indexMap}`}
                          >
                            {/* Extra Name Input */}
                            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                              <span className="text-xl font-TextFontRegular text-thirdColor">
                                {t("ExtraName")} {tap.name}:
                              </span>
                              <TextInput
                                value={
                                  ele.names.find(
                                    (name) => name.tranlation_name === tap.name
                                  )?.extra_name
                                }
                                onChange={(e) =>
                                  handleExtraNameChange(
                                    indexMap,
                                    tap.name,
                                    e.target.value
                                  )
                                }
                                placeholder={t("ExtraName")}
                              />
                            </div>

                            {/* Extra Price Input (shown for all languages but only editable in first) */}
                            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                              <span className="text-xl font-TextFontRegular text-thirdColor">
                                {t("DefaultPrice")}:
                              </span>
                              {index === 0 ? (
                                <NumberInput
                                  value={ele.extra_price}
                                  onChange={(e) =>
                                    handleExtraPriceChange(
                                      indexMap,
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("DefaultPrice")}
                                />
                              ) : (
                                <NumberInput
                                  value={ele.extra_price}
                                  readOnly
                                  placeholder={t("DefaultPrice")}
                                />
                              )}
                            </div>

                            {/* Remove Button (only shown for first language) */}
                            {index === 0 && (
                              <div className="flex items-end mt-10">
                                <StaticButton
                                  text="Remove"
                                  handleClick={() =>
                                    handleRemoveExtra(indexMap)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        {index === 0 && (
                          <div
                            className={`w-full flex items-center ${
                              productExtra.length === 0
                                ? "justify-center"
                                : "justify-start"
                            }`}
                          >
                            <ButtonAdd
                              isWidth={true}
                              Color="mainColor"
                              Text={
                                productExtra.length === 0
                                  ? t("AddExtra")
                                  : t("AddMoreExtra")
                              }
                              handleClick={handleAddExtra}
                            />
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Product Variations */}
            <div className="flex flex-col items-start justify-start w-full gap-4 pb-4 border-b-4 border-gray-300">
              {productVariations.length !== 0 && (
                <div className="flex items-center justify-start w-full gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleVariationTap(index)}
                      className={`${
                        currentVariationTap === index
                          ? "text-mainColor border-b-4 border-mainColor"
                          : "text-thirdColor"
                      }  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                    >
                      {tap.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-full">
                {taps.map(
                  (tap, index) =>
                    currentVariationTap === index && (
                      <div
                        className="flex flex-col items-center justify-center w-full gap-4"
                        key={tap.id}
                      >
                        {(productVariations || []).map(
                          (ele, indexVariation) => (
                            <div
                              className="flex flex-wrap items-start justify-start w-full gap-5 p-3 border-4 shadow border-mainColor rounded-2xl sm:flex-col lg:flex-row"
                              key={`${tap.id}-${indexVariation}`}
                            >
                              {/* Variation Name */}
                              <div className="sm:w-full lg:w-[30%] flex sm:flex-col lg:flex-row items-start justify-start gap-5">
                                <div className="flex flex-col items-start justify-center w-full gap-y-1">
                                  <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("VariationName")} {tap.name}:
                                  </span>
                                  <TextInput
                                    value={
                                      ele.names.find(
                                        (name) =>
                                          name.tranlation_name === tap.name
                                      )?.name
                                    }
                                    onChange={(e) =>
                                      updateVariationState(
                                        setProductVariations,
                                        indexVariation,
                                        "names",
                                        tap.name,
                                        e.target.value
                                      )
                                    }
                                    placeholder={t("VariationName")}
                                  />
                                </div>
                              </div>
                              {index === 0 && (
                                <>
                                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                      Variation Type:
                                    </span>
                                    <DropDown
                                      ref={(el) =>
                                        (variationTypeRef.current[
                                          indexVariation
                                        ] = el)
                                      } // Ensure correct indexing for refs
                                      handleOpen={() =>
                                        handleOpenVariationType(indexVariation)
                                      } // Pass index of current variation
                                      stateoption={ele.type || "Select Type"}
                                      openMenu={
                                        openVariationIndex === indexVariation
                                      } // Open only if index matches the open state
                                      handleOpenOption={
                                        handleOpenOptionProductVariationType
                                      }
                                      options={[
                                        { name: t("single") },
                                        { name: t("multiple") },
                                      ]}
                                      onSelectOption={(option) =>
                                        handleSelectProductVariationType(
                                          option,
                                          indexVariation
                                        )
                                      }
                                    />
                                  </div>

                                  {ele.type === "multiple" && (
                                    <>
                                      <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                          {t("Min")}:
                                        </span>
                                        <NumberInput
                                          value={ele.min} // Ensure `ele.points` has a default if undefined
                                          onChange={(e) => {
                                            const updatedValue = e.target.value;
                                            setProductVariations(
                                              (prevProductVariations) =>
                                                prevProductVariations.map(
                                                  (item, idx) =>
                                                    idx === indexVariation
                                                      ? {
                                                          ...item,
                                                          min: updatedValue, // Ensure this sets `points` correctly
                                                        }
                                                      : item
                                                )
                                            );
                                          }}
                                          placeholder={t("Min")}
                                        />
                                      </div>

                                      <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                          {t("Max")}:
                                        </span>
                                        <NumberInput
                                          value={ele.max} // Ensure `ele.points` has a default if undefined
                                          onChange={(e) => {
                                            const updatedValue = e.target.value;
                                            setProductVariations(
                                              (prevProductVariations) =>
                                                prevProductVariations.map(
                                                  (item, idx) =>
                                                    idx === indexVariation
                                                      ? {
                                                          ...item,
                                                          max: updatedValue, // Ensure this sets `points` correctly
                                                        }
                                                      : item
                                                )
                                            );
                                          }}
                                          placeholder={t("Max")}
                                        />
                                      </div>
                                    </>
                                  )}

                                  <div className="w-[32%] flex mt-10 items-center justify-center gap-x-3">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                            {t("Required")}:
                                    </span>
                                    <Switch
                                      handleClick={() => {
                                        setProductVariations(
                                          (prevProductVariations) =>
                                            prevProductVariations.map(
                                              (item, idx) =>
                                                idx === indexVariation
                                                  ? {
                                                      ...item,
                                                      required:
                                                        item.required === 1
                                                          ? 0
                                                          : 1, // Toggle between 1 and 0
                                                    }
                                                  : item
                                            )
                                        );
                                      }}
                                      checked={ele.required === 1} // Consider it checked if `required` is 1
                                    />
                                  </div>
                                  <div className="w-full">
                                    <TitlePage text={t("Options Variation")} />
                                  </div>
                                </>
                              )}

                              {index === 0 && (
                                <>
                                  {/* Options */}
                                  <div className="flex items-center justify-start w-full gap-x-6">
                                    {/* Tabs for variation options */}
                                    {taps.map((tap, index) => (
                                      <span
                                        key={tap.id}
                                        onClick={() =>
                                          handleVariationOptionTap(index)
                                        }
                                        className={`${
                                          currentVariationOptionTap === index
                                            ? "text-mainColor border-b-4 border-mainColor"
                                            : "text-thirdColor"
                                        } 
                            pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                                      >
                                        {tap.name}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Render each variation's options */}
                                  {taps.map(
                                    (tapOption, indexOptionTap) =>
                                      currentVariationOptionTap ===
                                        indexOptionTap && (
                                        <div
                                          className="flex flex-col items-start justify-start w-full gap-4"
                                          key={tapOption.id}
                                        >
                                          <div className="flex flex-wrap items-start justify-start gap-5 sm:w-full">
                                            {/* Render options */}
                                            {ele.options.map(
                                              (option, indexOption) => (
                                                <div
                                                  className="flex flex-wrap items-start justify-start gap-5 p-5 pt-0 shadow-md sm:w-full rounded-xl"
                                                  key={`${indexOption}-${tapOption.id}`}
                                                >
                                                  {/* Option Name */}
                                                  <div className="w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                                      {t("OptionName")}{" "}
                                                      {tapOption.name}:
                                                    </span>
                                                    <TextInput
                                                      value={
                                                        option.names.find(
                                                          (nameObj) =>
                                                            nameObj.tranlation_name ===
                                                            tapOption.name
                                                        )?.name
                                                      }
                                                      onChange={(e) => {
                                                        const updatedValue =
                                                          e.target.value;
                                                        setProductVariations(
                                                          (prevVariations) =>
                                                            prevVariations.map(
                                                              (
                                                                variation,
                                                                idx
                                                              ) =>
                                                                idx ===
                                                                indexVariation
                                                                  ? {
                                                                      ...variation,
                                                                      options:
                                                                        variation.options.map(
                                                                          (
                                                                            opt,
                                                                            optIdx
                                                                          ) =>
                                                                            optIdx ===
                                                                            indexOption
                                                                              ? {
                                                                                  ...opt,
                                                                                  names:
                                                                                    opt.names.map(
                                                                                      (
                                                                                        nameObj
                                                                                      ) =>
                                                                                        nameObj.tranlation_name ===
                                                                                        tapOption.name
                                                                                          ? {
                                                                                              ...nameObj,
                                                                                              name: updatedValue,
                                                                                            }
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
  placeholder={t("OptionName")} />
                                                    
                                                  </div>
                                                  {indexOptionTap === 0 && (
                                                    <>
                                                      {/* Option Price */}
                                                      <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                                          {t("Price")}:
                                                        </span>
                                                        <NumberInput
                                                          value={option.price}
                                                          onChange={(e) => {
                                                            const updatedValue =
                                                              e.target.value;
                                                            setProductVariations(
                                                              (
                                                                prevProductVariations
                                                              ) =>
                                                                prevProductVariations.map(
                                                                  (item, idx) =>
                                                                    idx ===
                                                                    indexVariation
                                                                      ? {
                                                                          ...item,
                                                                          options:
                                                                            item.options.map(
                                                                              (
                                                                                opt,
                                                                                optIdx
                                                                              ) =>
                                                                                optIdx ===
                                                                                indexOption
                                                                                  ? {
                                                                                      ...opt,
                                                                                      price:
                                                                                        updatedValue,
                                                                                    }
                                                                                  : opt
                                                                            ),
                                                                        }
                                                                      : item
                                                                )
                                                            );
                                                          }}
                                                          placeholder={t("Price")}
                                                        />
                                                      </div>
                                                      <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                                          {t("Point")}:
                                                        </span>
                                                        <NumberInput
                                                          value={option.points} // Ensure `ele.points` has a default if undefined
                                                          onChange={(e) => {
                                                            const updatedValue =
                                                              e.target.value;
                                                            setProductVariations(
                                                              (
                                                                prevProductVariations
                                                              ) =>
                                                                prevProductVariations.map(
                                                                  (item, idx) =>
                                                                    idx ===
                                                                    indexVariation
                                                                      ? {
                                                                          ...item,
                                                                          options:
                                                                            item.options.map(
                                                                              (
                                                                                opt,
                                                                                optIdx
                                                                              ) =>
                                                                                optIdx ===
                                                                                indexOption
                                                                                  ? {
                                                                                      ...opt,
                                                                                      points:
                                                                                        updatedValue,
                                                                                    }
                                                                                  : opt
                                                                            ),
                                                                        }
                                                                      : item
                                                                )
                                                            );
                                                          }}
                                                          placeholder={t("Point")}
                                                        />
                                                      </div>

                                                      {/* Option Status */}
                                                      <div className="w-[20%] flex items-center justify-start gap-x-3 lg:mt-3">
                                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                                          {t("Status")}:
                                                        </span>
                                                        <Switch
                                                          handleClick={() =>
                                                            setProductVariations(
                                                              (
                                                                prevProductVariations
                                                              ) =>
                                                                prevProductVariations.map(
                                                                  (item, idx) =>
                                                                    idx ===
                                                                    indexVariation
                                                                      ? {
                                                                          ...item,
                                                                          options:
                                                                            item.options.map(
                                                                              (
                                                                                opt,
                                                                                optIdx
                                                                              ) =>
                                                                                optIdx ===
                                                                                indexOption
                                                                                  ? {
                                                                                      ...opt,
                                                                                      status:
                                                                                        opt.status
                                                                                          ? 0
                                                                                          : 1,
                                                                                    }
                                                                                  : opt
                                                                            ),
                                                                        }
                                                                      : item
                                                                )
                                                            )
                                                          }
                                                          checked={
                                                            option.status === 1
                                                          }
                                                        />
                                                      </div>
                                                    </>
                                                  )}

                                                  {/* Inside the variation options section */}
                                                  {/* Inside variation options */}
                                                  {option.extra.map(
                                                    (extra, extraIndex) => {
                                                      // Only show in first language tab (indexOptionTap === 0)
                                                      if (indexOptionTap !== 0)
                                                        return null;

                                                      const selectedExtra =
                                                        productExtra.find(
                                                          (ex) =>
                                                            ex.extra_index ===
                                                            extra.extra_index
                                                        );
                                                      const defaultPrice =
                                                        selectedExtra?.extra_price ||
                                                        "";

                                                      return (
                                                        <div
                                                          className="flex flex-wrap items-start justify-start w-full gap-5"
                                                          key={`${tapOption.id}-${indexOption}-${extraIndex}`}
                                                        >
                                                          {/* Extra Selection Dropdown */}
                                                          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                            <span className="text-xl font-TextFontRegular text-thirdColor">
                                                            {t("Select Extra")}:
                                                            </span>
                                                            <DropDown
                                                              ref={(el) =>
                                                                (extraDropdownRef.current[
                                                                  `${indexVariation}-${indexOption}-${extraIndex}`
                                                                ] = el)
                                                              }
                                                              handleOpen={() =>
                                                                handleOpenExtraDropdown(
                                                                  indexVariation,
                                                                  indexOption,
                                                                  extraIndex
                                                                )
                                                              }
                                                              stateoption={
                                                                selectedExtra
                                                                  ? selectedExtra
                                                                      .names[0]
                                                                      ?.extra_name ||
                                                                    `Extra ${
                                                                      extra.extra_index +
                                                                      1
                                                                    }`
                                                                  : "Select Extra"
                                                              }
                                                              openMenu={
                                                                openExtraDropdown ===
                                                                `${indexVariation}-${indexOption}-${extraIndex}`
                                                              }
                                                              options={productExtra
                                                                .filter(
                                                                  (ex) =>
                                                                    // Show if not used in other extras or is the current selection
                                                                    !option.extra.some(
                                                                      (e) =>
                                                                        e.extra_index ===
                                                                          ex.extra_index &&
                                                                        e !==
                                                                          extra
                                                                    ) ||
                                                                    ex.extra_index ===
                                                                      extra.extra_index
                                                                )
                                                                .map((ex) => ({
                                                                  name:
                                                                    ex.names.find(
                                                                      (n) =>
                                                                        n.tranlation_name ===
                                                                        taps[0]
                                                                          .name
                                                                    )
                                                                      ?.extra_name ||
                                                                    `Extra ${
                                                                      ex.extra_index +
                                                                      1
                                                                    }`,
                                                                  value:
                                                                    ex.extra_index,
                                                                }))}
                                                              onSelectOption={(
                                                                selected
                                                              ) => {
                                                                const selectedExtra =
                                                                  productExtra.find(
                                                                    (ex) =>
                                                                      ex.extra_index ===
                                                                      selected.value
                                                                  );
                                                                if (
                                                                  selectedExtra
                                                                ) {
                                                                  setProductVariations(
                                                                    (prev) =>
                                                                      prev.map(
                                                                        (
                                                                          variation,
                                                                          vIdx
                                                                        ) =>
                                                                          vIdx ===
                                                                          indexVariation
                                                                            ? {
                                                                                ...variation,
                                                                                options:
                                                                                  variation.options.map(
                                                                                    (
                                                                                      opt,
                                                                                      oIdx
                                                                                    ) =>
                                                                                      oIdx ===
                                                                                      indexOption
                                                                                        ? {
                                                                                            ...opt,
                                                                                            extra:
                                                                                              opt.extra.map(
                                                                                                (
                                                                                                  ext,
                                                                                                  eIdx
                                                                                                ) =>
                                                                                                  eIdx ===
                                                                                                  extraIndex
                                                                                                    ? {
                                                                                                        ...ext,
                                                                                                        extra_index:
                                                                                                          selectedExtra.extra_index,
                                                                                                        extra_price:
                                                                                                          selectedExtra.extra_price, // Set default price initially
                                                                                                        extra_names:
                                                                                                          selectedExtra.names,
                                                                                                      }
                                                                                                    : ext
                                                                                              ),
                                                                                          }
                                                                                        : opt
                                                                                  ),
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
 {t( "OverridePrice")}                                                           
                                                            </span>
                                                            <NumberInput
                                                              value={
                                                                extra.extra_price
                                                              }
                                                              onChange={(e) =>
                                                                handleExtraPriceOverride(
                                                                  indexVariation,
                                                                  indexOption,
                                                                  extraIndex,
                                                                  e.target.value
                                                                )
                                                              }
                                                              placeholder={t( "OverridePrice")} 
                                                            />
                                                          </div>

                                                          {/* Remove Extra Button */}
                                                          <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
                                                            <StaticButton
                                                              text={t("Remove Extra")}
                                                              handleClick={() =>
                                                                handleRemoveExtraAtOption(
                                                                  indexVariation,
                                                                  indexOption,
                                                                  extraIndex
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                  {/* Add Extra Button */}
                                                  <div className="flex items-center justify-center sm:w-full">
                                                    <ButtonAdd
                                                      isWidth={true}
                                                      Color="mainColor"
                                                      Text={t("AddExtra")}
                                                      handleClick={() =>
                                                        handleAddExtraAtOption(
                                                          indexVariation,
                                                          indexOption
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  {ele.options.length > 1 && (
                                                    <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
                                                      <StaticButton
                                                        text={t("Removeoption")}
                                                        handleClick={() =>
                                                          handleRemoveOption(
                                                            indexVariation,
                                                            indexOption
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                  )}

                                  <div className="flex flex-col w-full gap-y-3">
                                    <div className="flex items-center justify-center sm:w-full">
                                      <ButtonAdd
                                        isWidth={true}
                                        Color="mainColor"
                                        Text={t("AddOption")}
                                        handleClick={() =>
                                          handleAddOption(indexVariation)
                                        }
                                      />
                                    </div>

                                    <div className="flex items-center justify-end sm:w-full">
                                      <div className="sm:w-full lg:w-auto">
                                        <StaticButton
                                          text={t("RemoveVariation")}
                                          handleClick={() =>
                                            handleRemoveVariation(
                                              indexVariation
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        )}
                        {index === 0 && (
                          <div
                            className={`w-full flex items-center ${
                              productVariations.length === 0
                                ? "justify-center"
                                : "justify-start"
                            }`}
                          >
                            <ButtonAdd
                              isWidth={true}
                              Color="mainColor"
                              Text={
                                productVariations.length === 0
                                    ? t("Add Variation")
                                  : t("Add More Variation")
                              }
                              handleClick={handleAddVariation}
                            />
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>

          {/* Buttons*/}
          <div className="flex items-center justify-end w-full gap-x-4">
            <div>
              <StaticButton
                text={t("Reset")}
                handleClick={handleReset}
                bgColor="bg-transparent"
                Color="text-mainColor"
                border={"border-2"}
                borderColor={"border-mainColor"}
                rounded="rounded-full"
              />
            </div>
            <div>
              <SubmitButton
                text={t("AddProduct")}
                rounded="rounded-full"
                handleClick={handleproductEdit}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default EditProductPage;
