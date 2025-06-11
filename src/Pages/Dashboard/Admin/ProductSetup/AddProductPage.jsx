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
import { useTranslation } from "react-i18next";

const AddProductPage = () => {
  const { t, i18n } = useTranslation();

  const auth = useAuth();
  /* Get Data */
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
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
    url: `${apiUrl}/admin/product/add`,
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
  const groupRef = useRef();
  const extraRef = useRef();

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
  const [groups, setGroups] = useState([]);
  const [extras, setExtras] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({}); // Object to store extras for each group

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
  const [selectedCategoryState, setSelectedCategoryState] = useState(
    t("Selected Category")
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Product SubCategory
  const [selectedSubCategoryState, setSelectedSubCategoryState] = useState(
    t("Selected Subcategory")
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  // Product Discount
  const [selectedDiscountState, setSelectedDiscountState] = useState(
    t("Selected Discount")
  );
  const [selectedDiscountId, setSelectedDiscountId] = useState("");

  // Product Tax
  const [selectedTaxState, setSelectedTaxState] = useState(t("Selected Tax"));
  const [selectedTaxId, setSelectedTaxId] = useState("");

  // Product Addons
  const [selectedAddonsState, setSelectedAddonsState] = useState(
    t("Selected Addons")
  );
  const [selectedAddonsId, setSelectedAddonsId] = useState([]);

  // Product Item Types
  const [selectedItemTypeState, setSelectedItemTypeState] = useState(
    t("Selected Item Type")
  );
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


  // Product Group
  const [selectedGroupState, setSelectedGroupState] = useState(
    t("Selected Group")
  );
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [selectedOptionGroups, setSelectedOptionGroups] = useState({});
  const [selectedOptionExtras, setSelectedOptionExtras] = useState({});
  /* dropdown Status */
  const [isOPenProductCategory, setIsOPenProductCategory] = useState(false);
  const [isOPenProductSubCategory, setIsOPenProductSubCategory] = useState(false);
  const [isOPenProductItemType, setIsOPenProductItemType] = useState(false);
  const [isOPenProductStockType, setIsOPenProductStockType] = useState(false);
  const [isOPenProductDiscount, setIsOPenProductDiscount] = useState(false);
  const [isOPenProductTax, setIsOPenProductTax] = useState(false);
  const [isOPenProductGroup, setIsOPenProductGroup] = useState(false);

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
      setCategories(
        [
          { id: "", name: t("Select Category") },
          ...dataCategory.parent_categories,
        ] || []
      );
      setSubCategories(
        [
          { id: "", name: t("Select Subcategory") },
          ...dataCategory?.sub_categories,
        ] || []
      );
      // setFilterSubCategories(dataCategory?.sub_categories || [])
      setAddons(dataCategory?.addons || []);
    }
    /* Set data to Discounts && Taxes */
    if (dataProduct) {
      setDiscounts(
        [{ id: "", name: t("Select Discount") }, ...dataProduct?.discounts] ||
        []
      );
      setTaxes(
        [{ id: "", name: t("Select Tax") }, ...dataProduct?.taxes] || []
      );
      setGroups(dataProduct?.group || []);
    }
  }, [dataTranslation, dataCategory, dataProduct]);

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
    setIsOPenProductGroup(false);
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
    setSelectedItemTypeName(option.id);
    setSelectedItemTypeState(option.name);
    console.log("option", option);
  };
  const handleSelectProductStockType = (option) => {
    setSelectedStockTypeName(option.id);
    setSelectedStockTypeState(option.name);
    setProductStockNumber("");
  };
  const handleSelectProductDiscount = (option) => {
    console.log("option", option);
    setSelectedDiscountId(option.id);
    setSelectedDiscountState(option.name);
  };
  const handleSelectProductTax = (option) => {
    console.log("option", option);
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
    setProductStatusFrom(null);
    setProductStatusTo(null);
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
        !taxRef.current.contains(event.target) &&
        groupRef.current &&
        !groupRef.current.contains(event.target)
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
    setIsOPenProductGroup,
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
    setSelectedGroupState(t("Selected Groups"));
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




  // Handle group selection and auto-select all extras
  const handleGroupChange = (e) => {
    const selected = e.value; // Array of selected group IDs
    setSelectedGroups(selected);

    // Update selectedExtras: auto-select all extras for newly selected groups
    const updatedExtras = { ...selectedExtras };
    selected.forEach((groupId) => {
      if (!updatedExtras[groupId]) {
        // If group is newly selected, select all its extras by default
        const extras = getExtrasForGroup(groupId);
        updatedExtras[groupId] = extras.map((extra) => extra.id);
      }
    });

    // Remove extras for deselected groups
    Object.keys(updatedExtras).forEach((groupId) => {
      if (!selected.includes(Number(groupId))) {
        delete updatedExtras[groupId];
      }
    });

    setSelectedExtras(updatedExtras);
  };

  // Handle extra selection for a specific group
  const handleExtraChange = (groupId, selectedExtraIds) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [groupId]: selectedExtraIds,
    }));
  };

  // Filter extras for a specific group
  const getExtrasForGroup = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    return group && group.extra ? group.extra : [];
  };

  // Handle group selection for a specific variation option
  const handleOptionGroupChange = (variationIndex, optionIndex, selectedGroupIds) => {
    const key = `${variationIndex}-${optionIndex}`;
    setSelectedOptionGroups((prev) => ({
      ...prev,
      [key]: selectedGroupIds,
    }));

    // Update selectedOptionExtras: auto-select all extras for newly selected groups
    const updatedExtras = { ...selectedOptionExtras[key] } || {};
    selectedGroupIds.forEach((groupId) => {
      if (!updatedExtras[groupId]) {
        const extras = getExtrasForGroup(groupId);
        console.log(`Extras for group ${groupId} in variation ${key}:`, extras); // Debug
        updatedExtras[groupId] = extras.map((extra) => extra.id); // Use 'id'
      }
    });

    // Remove extras for deselected groups
    Object.keys(updatedExtras).forEach((groupId) => {
      if (!selectedGroupIds.includes(Number(groupId))) {
        delete updatedExtras[groupId];
      }
    });

    setSelectedOptionExtras((prev) => ({
      ...prev,
      [key]: updatedExtras,
    }));
  };
  // Handle extras selection for a specific group within a variation option
  const handleOptionExtrasChange = (variationIndex, optionIndex, groupId, selectedExtraIds) => {
    const key = `${variationIndex}-${optionIndex}`;
    console.log(`Updating extras for ${key}, group ${groupId}:`, selectedExtraIds); // Debug
    setSelectedOptionExtras((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [groupId]: selectedExtraIds,
      },
    }));
  };

  /* Add Product */
  const handleproductAdd = (e) => {
    e.preventDefault();

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
      const addonIds = selectedAddonsId.map((addon) => addon.id);
      addonIds.forEach((id, indexID) => {
        formData.append(`addons[${indexID}]`, id);
      });
    }

    productNames.forEach((name, index) => {
      formData.append(`product_names[${index}][product_name]`, name.product_name);
      formData.append(`product_names[${index}][tranlation_id]`, name.tranlation_id);
      formData.append(`product_names[${index}][tranlation_name]`, name.tranlation_name);
    });

    descriptionNames.forEach((name, index) => {
      formData.append(`product_descriptions[${index}][product_description]`, name.description_name);
      formData.append(`product_descriptions[${index}][tranlation_name]`, name.tranlation_name);
      formData.append(`product_descriptions[${index}][tranlation_id]`, name.tranlation_id);
    });

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
    }
    

    // Send only the selected extra IDs from selectedExtras for top-level extra
    if (Object.keys(selectedExtras).length > 0) {
      let extraIndex = 0;
      Object.entries(selectedExtras).forEach(([groupId, extraIds]) => {
        if (Array.isArray(extraIds)) {
          extraIds.forEach((extraId) => {
            formData.append(`extra[${extraIndex}][id]`, extraId);
            extraIndex++;
          });
        }
      });
    }

    // Debug: Log selectedOptionExtras to verify its content
    console.log("selectedOptionExtras:", JSON.stringify(selectedOptionExtras, null, 2));

    if (Array.isArray(productVariations)) {
      productVariations.forEach((variation, indexVar) => {
        console.log(`Processing variation index ${indexVar}`, variation);

        /* Names */
        if (Array.isArray(variation.names)) {
          variation.names.forEach((name, index) => {
            console.log(`Processing name at index ${index}:`, name);
            formData.append(`variations[${indexVar}][names][${index}][name]`, name.name);
            formData.append(`variations[${indexVar}][names][${index}][tranlation_name]`, name.tranlation_name);
            formData.append(`variations[${indexVar}][names][${index}][tranlation_id]`, name.tranlation_id);
          });
        } else {
          console.warn(`variation.names is not a valid array for variation index ${indexVar}`);
        }

        if (Array.isArray(variation.options)) {
          variation.options.forEach((option, indexOption) => {
            // Extra Option Handling using selectedOptionExtras
            const extraKey = `${indexVar}-${indexOption}`;
            const selectedExtrasForOption = selectedOptionExtras[extraKey] || {};
            console.log(`Processing option ${indexVar}-${indexOption}, selectedExtrasForOption:`, selectedExtrasForOption);

            if (Object.keys(selectedExtrasForOption).length > 0) {
              let extraIndex = 0;
              Object.values(selectedExtrasForOption).flat().forEach((extraId) => {
                console.log(`Appending extra_index for ${extraKey}, extraIndex ${extraIndex}:`, extraId);
                formData.append(
                  `variations[${indexVar}][options][${indexOption}][extra][${extraIndex}][extra_index]`,
                  extraId !== undefined ? String(extraId) : ""
                );
                extraIndex++;
              });
            } else {
              console.warn(`No extras found for option ${extraKey}`);
            }

            // Names Option Handling
            if (Array.isArray(option.names) && option.names.length > 0) {
              option.names.forEach((optionNa, indexOpNa) => {
                formData.append(
                  `variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`,
                  optionNa.name && typeof optionNa.name === "string" ? optionNa.name : ""
                );
                formData.append(
                  `variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_id]`,
                  optionNa.tranlation_id !== undefined ? String(optionNa.tranlation_id) : ""
                );
                formData.append(
                  `variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_name]`,
                  typeof optionNa.tranlation_name === "string" ? optionNa.tranlation_name : ""
                );
              });
            }

            // Append other option-specific data
            formData.append(`variations[${indexVar}][options][${indexOption}][price]`, option.price || 0);
            formData.append(`variations[${indexVar}][options][${indexOption}][status]`, option.status);
            formData.append(`variations[${indexVar}][options][${indexOption}][points]`, option.points || 0);
          });
        }

        // Append general variation data
        formData.append(`variations[${indexVar}][type]`, variation.type);
        formData.append(`variations[${indexVar}][min]`, variation.min);
        formData.append(`variations[${indexVar}][max]`, variation.max);
        formData.append(`variations[${indexVar}][required]`, variation.required ? 1 : 0);
      });
    }

    // Debug: Log only extra-related form data
    for (const [key, value] of formData.entries()) {
      if (key.includes("extra")) {
        console.log(`${key}: ${value}`);
      }
    }

    postData(formData, t("Product Added Success"));
  };

  useEffect(() => {
    if (response && response.status === 200) {
      handleReset();
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
          onSubmit={handleproductAdd}
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
                    className={`${currentProductNamesTap === index
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

            <div className="w-full p-6 bg-gray-50 rounded-2xl shadow-lg">
              {/* Group MultiSelect */}
              <div className="mb-6 w-full sm:w-full lg:w-[30%] ">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("Group Extra Names")}:
                </label>
                <MultiSelect
                  value={selectedGroups}
                  onChange={handleGroupChange}
                  options={groups}
                  optionLabel="name"
                  optionValue="id"
                  display="chip"
                  placeholder={selectedGroupState}
                  // maxSelectedLabels={3}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                  panelClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
                />
              </div>

              {/* Extras MultiSelects */}
              {selectedGroups.length > 0 && (
                <div className="space-y-6">
                  {selectedGroups.map((groupId) => {
                    const group = groups.find((g) => g.id === groupId);
                    return (
                      <div
                        key={groupId}
                        className="p-4 bg-white rounded-xl shadow-sm animate-fadeIn"
                      >
                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                          {t("Extra Names")} for {group?.name || 'Group'}:
                        </label>
                        <MultiSelect
                          value={selectedExtras[groupId] || []}
                          onChange={(e) => handleExtraChange(groupId, e.value)}
                          options={getExtrasForGroup(groupId)}
                          optionLabel="name"
                          optionValue="id"
                          display="chip"
                          placeholder={t("Select Extras")}
                          // maxSelectedLabels={5}
                          className="w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                          panelClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Exclude Names */}
            <div className="flex flex-col items-start justify-start w-full gap-4 pb-4 border-b-4 border-gray-300">
              {productExclude.length !== 0 && (
                <div className="flex items-center justify-start w-full gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleExcludeNamesTap(index)}
                      className={`${currentExcludeNamesTap === index
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
                            className={`w-full flex items-center ${productExclude.length === 0
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


            {/* Product Variations */}
            <div className="flex flex-col items-start justify-start w-full gap-4 pb-4 border-b-4 border-gray-300">
              {productVariations.length !== 0 && (
                <div className="flex items-center justify-start w-full gap-x-6">
                  {taps.map((tap, index) => (
                    <span
                      key={tap.id}
                      onClick={() => handleVariationTap(index)}
                      className={`${currentVariationTap === index
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
                    currentVariationTap === index && (
                      <div
                        className="flex flex-col items-center justify-center w-full gap-4"
                        key={tap.id}
                      >
                        {(productVariations || []).map((ele, indexVariation) => (
                          <div
                            className="flex flex-wrap items-start justify-start w-full gap-5 p-3 border-4 shadow border-mainColor rounded- Pty-2xl sm:flex-col lg:flex-row"
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
                                    ele.names.find((name) => name.tranlation_name === tap.name)?.name
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
                                    {t("Variation Type")}:
                                  </span>
                                  <DropDown
                                    ref={(el) => (variationTypeRef.current[indexVariation] = el)}
                                    handleOpen={() => handleOpenVariationType(indexVariation)}
                                    stateoption={ele.type || "Select Type"}
                                    openMenu={openVariationIndex === indexVariation}
                                    handleOpenOption={handleOpenOptionProductVariationType}
                                    options={[
                                      { name: t("single") },
                                      { name: t("multiple") },
                                    ]}
                                    onSelectOption={(option) =>
                                      handleSelectProductVariationType(option, indexVariation)
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
                                        value={ele.min}
                                        onChange={(e) => {
                                          const updatedValue = e.target.value;
                                          setProductVariations((prevProductVariations) =>
                                            prevProductVariations.map((item, idx) =>
                                              idx === indexVariation
                                                ? { ...item, min: updatedValue }
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
                                        value={ele.max}
                                        onChange={(e) => {
                                          const updatedValue = e.target.value;
                                          setProductVariations((prevProductVariations) =>
                                            prevProductVariations.map((item, idx) =>
                                              idx === indexVariation
                                                ? { ...item, max: updatedValue }
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
                                      setProductVariations((prevProductVariations) =>
                                        prevProductVariations.map((item, idx) =>
                                          idx === indexVariation
                                            ? {
                                              ...item,
                                              required: item.required === 1 ? 0 : 1,
                                            }
                                            : item
                                        )
                                      );
                                    }}
                                    checked={ele.required === 1}
                                  />
                                </div>
                                <div className="w-full">
                                  <TitlePage text={t("Options Variation")} />
                                </div>
                              </>
                            )}

                            {index === 0 && (
                              <>
                                {/* Options Tabs */}
                                <div className="flex items-center justify-start w-full gap-x-6">
                                  {taps.map((tapOption, indexOptionTap) => (
                                    <span
                                      key={tapOption.id}
                                      onClick={() => handleVariationOptionTap(indexOptionTap)}
                                      className={`${currentVariationOptionTap === indexOptionTap
                                        ? "text-mainColor border-b-4 border-mainColor"
                                        : "text-thirdColor"
                                        } pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                                    >
                                      {tapOption.name}
                                    </span>
                                  ))}
                                </div>

                                {/* Render each variation's options */}
                                {taps.map(
                                  (tapOption, indexOptionTap) =>
                                    currentVariationOptionTap === indexOptionTap && (
                                      <div
                                        className="flex flex-col items-start justify-start w-full gap-4"
                                        key={tapOption.id}
                                      >
                                        <div className="flex flex-wrap items-start justify-start gap-5 sm:w-full">
                                          {ele.options.map((option, indexOption) => (
                                            <div
                                              className="flex flex-wrap items-start justify-start gap-5 p-5 pt-0 shadow-md sm:w-full rounded-xl"
                                              key={`${indexOption}-${tapOption.id}`}
                                            >
                                              {/* Option Name */}
                                              <div className="w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                                  {t("OptionName")} {tapOption.name}:
                                                </span>
                                                <TextInput
                                                  value={
                                                    option.names.find(
                                                      (nameObj) => nameObj.tranlation_name === tapOption.name
                                                    )?.name
                                                  }
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value;
                                                    setProductVariations((prevVariations) =>
                                                      prevVariations.map((variation, vIdx) =>
                                                        vIdx === indexVariation
                                                          ? {
                                                            ...variation,
                                                            options: variation.options.map(
                                                              (opt, oIdx) =>
                                                                oIdx === indexOption
                                                                  ? {
                                                                    ...opt,
                                                                    names: opt.names.map(
                                                                      (nameObj) =>
                                                                        nameObj.tranlation_name === tapOption.name
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
                                                  placeholder={t("OptionName")}
                                                />
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
                                                        const updatedValue = e.target.value;
                                                        setProductVariations((prevProductVariations) =>
                                                          prevProductVariations.map((item, idx) =>
                                                            idx === indexVariation
                                                              ? {
                                                                ...item,
                                                                options: item.options.map(
                                                                  (opt, oIdx) =>
                                                                    oIdx === indexOption
                                                                      ? {
                                                                        ...opt,
                                                                        price: updatedValue,
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
                                                  {/* Option Points */}
                                                  <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                                      {t("Point")}:
                                                    </span>
                                                    <NumberInput
                                                      value={option.points}
                                                      onChange={(e) => {
                                                        const updatedValue = e.target.value;
                                                        setProductVariations((prevProductVariations) =>
                                                          prevProductVariations.map((item, idx) =>
                                                            idx === indexVariation
                                                              ? {
                                                                ...item,
                                                                options: item.options.map(
                                                                  (opt, oIdx) =>
                                                                    oIdx === indexOption
                                                                      ? {
                                                                        ...opt,
                                                                        points: updatedValue,
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
                                                        setProductVariations((prevProductVariations) =>
                                                          prevProductVariations.map((item, idx) =>
                                                            idx === indexVariation
                                                              ? {
                                                                ...item,
                                                                options: item.options.map(
                                                                  (opt, oIdx) =>
                                                                    oIdx === indexOption
                                                                      ? {
                                                                        ...opt,
                                                                        status: opt.status ? 0 : 1,
                                                                      }
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
                                                  <div className="w-full flex flex-col gap-4 sm:gap-6">
                                                    {/* Group Selection */}
                                                    <div className="w-full sm:w-full lg:w-[30%] flex flex-col items-start gap-y-2">
                                                      <label className="text-lg font-semibold text-gray-800">
                                                        {t("Select Group")}:
                                                      </label>
                                                     <MultiSelect
                                                        value={selectedOptionGroups[`${indexVariation}-${indexOption}`] || []}
                                                        onChange={(e) => handleOptionGroupChange(indexVariation, indexOption, e.value)}
                                                        options={groups.map((group) => ({
                                                          name: group.name,
                                                          value: group.id,
                                                        }))}
                                                        optionLabel="name"
                                                        optionValue="value"
                                                        display="chip"
                                                        placeholder={t("Select Groups")}
                                                        className="w-full bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300 text-gray-700"
                                                        filter
                                                        filterPlaceholder={t("Search Groups")}
                                                        maxSelectedLabels={3}
                                                        aria-label={t("Select Groups")}
                                                      />
                                                    </div>

                                                    {/* Extras Selection for Each Group */}
                                                    {selectedOptionGroups[`${indexVariation}-${indexOption}`]?.length > 0 && (
                                                      <div className="w-full items-start gap-y-3 bg-gray-50 p-4 rounded-xl shadow-sm">
                                                        <label className="text-lg font-semibold text-gray-800">
                                                          {t("Select Extras")}:
                                                        </label>
                                                        <div className="w-full space-y-3">
                                                          {selectedOptionGroups[`${indexVariation}-${indexOption}`].map((groupId) => {
                                                            const group = groups.find((g) => g.id === groupId);
                                                            return (
                                                              <div
                                                                key={groupId}
                                                                className="w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                                              >
                                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                                  {t("Extras for")} {group?.name || t("Group")}:
                                                                </label>
                                                                <MultiSelect
                                                                  value={selectedOptionExtras[`${indexVariation}-${indexOption}`]?.[groupId] || []}
                                                                  onChange={(e) => handleOptionExtrasChange(indexVariation, indexOption, groupId, e.value)}
                                                                  options={getExtrasForGroup(groupId)}
                                                                  optionLabel="name"
                                                                  optionValue="id" // Changed from "value" to "id"
                                                                  display="chip"
                                                                  placeholder={t("Select Extras")}
                                                                  className="w-full bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300 text-gray-700"
                                                                  filter
                                                                  filterPlaceholder={t("Search Extras")}
                                                                  maxSelectedLabels={5}
                                                                  aria-label={`${t("Select Extras")} for ${group?.name || t("Group")}`}
                                                                />
                                                              </div>
                                                            );
                                                          })}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                  {/* Remove Option Button */}
                                                  {ele.options.length > 1 && (
                                                    <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
                                                      <StaticButton
                                                        text={t("Removeoption")}
                                                        handleClick={() =>
                                                          handleRemoveOption(indexVariation, indexOption)
                                                        }
                                                      />
                                                    </div>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex items-center justify-center sm:w-full">
                                          <ButtonAdd
                                            isWidth={true}
                                            Color="mainColor"
                                            Text={t("AddOption")}
                                            handleClick={() => handleAddOption(indexVariation)}
                                          />
                                        </div>
                                      </div>
                                    )
                                )}
                                <div className="flex items-center justify-end sm:w-full">
                                  <div className="sm:w-full lg:w-auto">
                                    <StaticButton
                                      text={t("RemoveVariation")}
                                      handleClick={() => handleRemoveVariation(indexVariation)}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {index === 0 && (
                          <div
                            className={`w-full flex items-center ${productVariations.length === 0 ? "justify-center" : "justify-start"
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
                handleClick={handleproductAdd}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddProductPage;
