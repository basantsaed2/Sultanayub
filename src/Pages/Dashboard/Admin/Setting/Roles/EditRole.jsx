// import { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   LoaderLogin,
//   StaticButton,
//   SubmitButton,
//   Switch,
//   TextInput,
// } from "../../../../../Components/Components";
// import { usePost } from "../../../../../Hooks/usePostJson";
// import { useAuth } from "../../../../../Context/Auth";
// import { MultiSelect } from "primereact/multiselect";
// import { useGet } from "../../../../../Hooks/useGet";

// const EditRolePage = () => {
//   const { roleId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const {
//     refetch: refetchRoles,
//     loading: loadingRoles,
//     data: dataRoles,
//   } = useGet({
//     url: `${apiUrl}/admin/admin_roles`,
//   });
  // const { postData, loadingPost, response } = usePost({
  //   url: `${apiUrl}/admin/admin_roles/update/${roleId}`,
  // });

//   const auth = useAuth();

//   const [roleName, setRoleName] = useState("");
//   const [permissionsData, setPermissionsData] = useState([]);
//   const [selectedPermissions, setSelectedPermissions] = useState([]);
//   const [availableActions, setAvailableActions] = useState([]);
//   const [selectedActions, setSelectedActions] = useState([]);
//   const [roleStatus, setRoleStatus] = useState(0);

//   // جلب الداتا من location.state
//   useEffect(() => {
//     if (location.state && location.state.roleData) {
//       const { roleData } = location.state;
//       console.log("roleData:", roleData);
//       setRoleName(roleData.name || "");
//       setRoleStatus(roleData.status || 0);

//       const newSelectedPermissions = roleData.roles.map((item) => ({
//         name: item.role,
//       })) || [];
//       setSelectedPermissions(newSelectedPermissions);

//       const newSelectedActions = roleData.roles.flatMap((item) => {
//         console.log("item:", item);
//         const actions = Array.isArray(item.action)
//           ? item.action
//           : item.action
//           ? [item.action]
//           : [];
//         return actions.map((action) => ({ name: action }));
//       }) || [];
//       setSelectedActions(newSelectedActions);
//     }
//   }, [location.state]);

//   // جلب الـ permissions المتاحة من الـ API
//   useEffect(() => {
//     refetchRoles();
//   }, [refetchRoles]);

//   useEffect(() => {
//     if (dataRoles) {
//       console.log("Data Roles:", dataRoles);

//       const newPermissionsData =
//         dataRoles?.roles && typeof dataRoles.roles === "object"
//           ? Object.entries(dataRoles.roles).map(([roleName, permissions]) => ({
//               name: roleName,
//               permissions: permissions,
//             }))
//           : [];
//       setPermissionsData(newPermissionsData);
//     }
//   }, [dataRoles]);

//   // تحديث availableActions بناءً على الـ Permissions المختارة
//   useEffect(() => {
//     if (Array.isArray(selectedPermissions) && Array.isArray(permissionsData)) {
//       const actions = selectedPermissions.flatMap((permission) => {
//         const found = permissionsData.find((p) => p.name === permission.name);
//         return found ? found.permissions : [];
//       });
//       const uniqueActions = [...new Set(actions)];
//       const newAvailableActions = uniqueActions.map((action) => ({
//         name: action,
//       }));
//       setAvailableActions(newAvailableActions);
//       console.log("availableActions:", newAvailableActions);
//     }
//   }, [selectedPermissions, permissionsData]);

//   const handleRoleStatus = () => {
//     setRoleStatus((prev) => (prev === 0 ? 1 : 0));
//   };

//   useEffect(() => {
//     if (response) {
//       handleBack();
//     }
//   }, [response]);

//   const handleBack = () => {
//     navigate(-1, { replace: true });
//   };

//   const handleRoleEdit = (e) => {
//     e.preventDefault();

//     if (!roleName) {
//       auth.toastError("Please enter a role name");
//       return;
//     }
//     if (selectedPermissions.length === 0) {
//       auth.toastError("Please select role permissions");
//       return;
//     }
//     if (selectedActions.length === 0) {
//       auth.toastError("Please select role actions");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", roleName);
//     formData.append("status", roleStatus);

//     selectedPermissions.forEach((permission, index) => {
//       formData.append(`roles[${index}][role]`, permission.name);
//       const relatedActions = selectedActions
//         .filter((action) => {
//           const permissionData = permissionsData.find(
//             (p) => p.name === permission.name
//           );
//           return (
//             permissionData && permissionData.permissions.includes(action.name)
//           );
//         })
//         .map((action) => action.name);
//       relatedActions.forEach((action, actionIndex) => {
//         formData.append(`roles[${index}][action][${actionIndex}]`, action);
//       });
//     });

//     postData(formData, "Role updated successfully");
//   };

//   if (!permissionsData || permissionsData.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center w-full h-40 text-center">
//         <h2 className="text-lg text-red-500 font-TextFontMedium">
//           No permissions available
//         </h2>
//         <p className="mt-2 text-sm text-gray-600">
//           Please check the API response or try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {loadingRoles || loadingPost ? (
//         <div className="flex items-center justify-center w-full py-10 mb-96 pb-96">
//           <LoaderLogin className="w-10 h-10" />
//         </div>
//       ) : (
//         <section className="px-4 py-8 sm:px-6 lg:px-8">
//           <form onSubmit={handleRoleEdit} className="space-y-10">
            
//             {/* Fields Section */}
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//               {/* Role Name */}
//               <div className="flex flex-col gap-y-2">
//                 <label className="text-sm font-semibold text-gray-800">
//                   Role Name:
//                 </label>
//                 <TextInput
//                   value={roleName}
//                   onChange={(e) => setRoleName(e.target.value)}
//                   placeholder="Enter Role Name"
//                   className="w-[70%] !rounded-none text-sm border !border-gray-300  shadow-sm focus:ring-2 focus:ring-red-500"
//                 />
//               </div>
  
//               {/* Permissions */}
//               <div className="flex flex-col gap-y-2">
//                 <label className="text-sm font-semibold text-gray-800">
//                   Permissions:
//                 </label>
//                 <MultiSelect
//                   value={selectedPermissions}
//                   onChange={(e) => setSelectedPermissions(e.value)}
//                   options={permissionsData}
//                   optionLabel="name"
//                   placeholder="Select Permissions"
//                   maxSelectedLabels={3}
//                   filter
//                   className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500"
//                   panelClassName="text-sm"
//                 />
//                 {selectedPermissions.length > 0 && (
//                   <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
//                     {selectedPermissions.map((permission, index) => (
//                       <li key={index}>{permission.name}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
  
//               {/* Actions */}
//               <div className="flex flex-col gap-y-2">
//                 <label className="text-sm font-semibold text-gray-800">
//                   Actions:
//                 </label>
//                 <MultiSelect
//                   value={selectedActions}
//                   onChange={(e) => setSelectedActions(e.value)}
//                   options={availableActions}
//                   optionLabel="name"
//                   placeholder="Select Actions"
//                   maxSelectedLabels={3}
//                   filter
//                   className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500"
//                   panelClassName="text-sm"
//                 />
//                 {selectedActions.length > 0 && (
//                   <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
//                     {selectedActions.map((action, index) => (
//                       <li key={index}>{action.name}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
  
//               {/* Role Status */}
//               <div className="flex flex-col gap-y-2">
//                 <label className="text-sm font-semibold text-gray-800">
//                   Active:
//                 </label>
//                 <div className="flex items-center gap-3">
//                   <Switch
//                     handleClick={handleRoleStatus}
//                     checked={roleStatus}
//                     className="scale-100"
//                   />
//                   <span className="text-sm text-gray-600">
//                     {roleStatus ? "Active" : "Inactive"}
//                   </span>
//                 </div>
//               </div>
//             </div>
  
//             {/* Buttons */}
//             <div className="flex justify-center gap-6 mb-96 pb-96">
//               <StaticButton
//                 text="Cancel"
//                 handleClick={handleBack}
//                 bgColor="bg-white"
//                 Color="text-red-600"
//                 border="border border-red-600"
//                 rounded="rounded-lg"
//                 className="px-8 py-2 text-sm font-semibold transition hover:bg-gray-50"
//               />
//               <SubmitButton
//                 text="Save Changes"
//                 rounded="rounded-lg"
//                 handleClick={handleRoleEdit}
//                 className="px-8 py-2 text-sm font-semibold text-white uppercase transition bg-red-600 hover:bg-red-700"
//               />
//             </div>
//           </form>
//         </section>
//       )}
//     </>
//   );
  
// };

// export default EditRolePage;

import { useEffect, useState } from "react";
import {
  StaticButton,
  StaticLoader,
  SubmitButton,
  Switch,
  TextInput,
} from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";

import { usePost } from "../../../../../Hooks/usePostJson";
import { useGet } from "../../../../../Hooks/useGet";
import { useAuth } from "../../../../../Context/Auth";
import { useNavigate ,useLocation } from "react-router-dom";
const EditRolePage = ({ update, setUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchRoles, loading: loadingRoles, data: dataRoles } = useGet({
    url: `${apiUrl}/admin/admin_roles`
  });
                     const {  t,i18n } = useTranslation();

  const auth = useAuth();
  const nevigate =useNavigate();
  const location = useLocation();
  const roleToEdit = location.state?.role;
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/admin_roles/update/${roleToEdit.id}`,
  });
  const [roleName, setRoleName] = useState('');
  const [permissionsData, setPermissionsData] = useState({}); // Initialize as object, not array
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleStatus, setRoleStatus] = useState(0);

  useEffect(() => {
    refetchRoles();
    console.log("roleToEdit",roleToEdit)

  }, [refetchRoles, update]);

  useEffect(() => {
    if (dataRoles && dataRoles.roles) {
      // Ensure this is an object
      setPermissionsData(dataRoles.roles || {}); 
      
      const initialSelected = {};
      Object.keys(dataRoles.roles || {}).forEach((category) => {
        initialSelected[category] = [];
      });
      setSelectedPermissions(initialSelected);
    }
  }, [dataRoles]);

  useEffect(() => {
    if (roleToEdit && permissionsData && Object.keys(permissionsData).length > 0) {
      console.log("roleToEdit", roleToEdit);
      setRoleName(roleToEdit.name || '');
      setRoleStatus(roleToEdit.status || 0);
  
      const initialSelectedPermissions = {};
  
      // Use the 'roles' array from roleToEdit
      if (roleToEdit.roles && Array.isArray(roleToEdit.roles)) {
        roleToEdit.roles.forEach(({ role, action }) => {
          if (permissionsData[role] && permissionsData[role].includes(action)) {
            initialSelectedPermissions[role] = [
              ...(initialSelectedPermissions[role] || []),
              action
            ];
          }
        });
      }
      setSelectedPermissions(initialSelectedPermissions);
    }
  }, [roleToEdit, permissionsData]);
  
  useEffect(() => {
    if (!loadingPost && response){
      nevigate(-1)
    }
  },[response])

  const handleSelectAll = () => {
    const allSelectedPermissions = {};
    Object.keys(permissionsData).forEach((category) => {
      allSelectedPermissions[category] = [...permissionsData[category]];
    });
    setSelectedPermissions(allSelectedPermissions);
  };

  // Deselect All Handler
  const handleDeselectAll = () => {
    const resetPermissions = {};
    Object.keys(permissionsData).forEach((category) => {
      resetPermissions[category] = [];
    });
    setSelectedPermissions(resetPermissions);
  };

  // Handle "Select All" Toggle for Each Category
  const handleSelectAllCategory = (category) => {
    // Add safety checks
    if (!permissionsData || !permissionsData[category]) {
      console.error(`Category ${category} not found in permissionsData`);
      return;
    }
  
    setSelectedPermissions((prev) => ({
      ...prev,
      [category]: prev[category]?.length === permissionsData[category].length
        ? [] // Deselect all if currently all selected
        : [...permissionsData[category]] // Select all otherwise
    }));
  };
  // Check if all permissions are selected in a category
  const isAllSelectedInCategory = (category) => {
    if (!permissionsData[category] || !selectedPermissions[category]) return false;
    return selectedPermissions[category].length === permissionsData[category].length;
  };

  // Toggle Select All/Deselect All based on current state
  const toggleSelectAll = () => {
    const isAllSelected = Object.values(selectedPermissions).every(
      (permissions, index) => permissions.length === Object.values(permissionsData)[index]?.length
    );

    if (isAllSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };

  // Check if all permissions are selected
  const areAllPermissionsSelected = Object.keys(permissionsData).every((category) => {
    const selected = selectedPermissions[category] || [];
    return selected.length === permissionsData[category].length;
  });  

  // Toggle individual permission selection within a category
  const handleTogglePermission = (category, permissionName) => {
    setSelectedPermissions((prev) => {
      const categoryPermissions = prev[category] || [];
      return {
        ...prev,
        [category]: categoryPermissions.includes(permissionName)
          ? categoryPermissions.filter((perm) => perm !== permissionName)
          : [...categoryPermissions, permissionName],
      };
    });
  };

  const handleRoleStatus = () => {
    setRoleStatus((prev) => (prev === 0 ? 1 : 0));
  };

  const handleReset = () => {
    setRoleName("");
    setSelectedPermissions([]);
    setRoleStatus(0);
  };

  const handleRoleAdd = (e) => {
    e.preventDefault();
  
    if (!roleName.trim()) {
      auth.toastError(t("enterRoleName"));
      return;
    }
  
    // Flatten selected permissions into an array of {category, permission} objects
    const flattenedPermissions = [];
    Object.entries(selectedPermissions).forEach(([category, permissions]) => {
      permissions.forEach(permission => {
        flattenedPermissions.push({
          category,
          permission
        });
      });
    });
  
    if (flattenedPermissions.length === 0) {
            auth.toastError(t("selectAtLeastOnePermission"));
      return;
    }
  
    const formData = new FormData();
    formData.append("name", roleName.trim());
    formData.append("status", roleStatus);
  
    // Add each permission with its actions
    flattenedPermissions.forEach(({category, permission}, index) => {
      formData.append(`roles[${index}][role]`, category); // Using permission name as role
      formData.append(`roles[${index}][action][]`, permission);
    
    });
  
    postData(formData, t("Role Updated Successfully"));
  };

  return (
    <>
      {loadingPost || loadingRoles ? (
        <div className="flex items-center justify-center w-full h-56">
          <StaticLoader />
        </div>
      ) : (
        <section className="p-6 mb-20 bg-white shadow-lg rounded-xl">
        <form onSubmit={handleRoleAdd} className="space-y-4">
          <div className="space-y-4">
            {/* Role Name Section */}
            <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="space-y-2 lg:col-span-1">
                <label htmlFor="role-name" className="block text-lg font-medium text-gray-700">
                  {t("RoleName")}:
                </label>
                <TextInput
                  id="role-name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder={t("EnterRoleName")}
                  className="w-full"
                />
              </div>
      
              {/* Active Toggle */}
              <div className="flex items-center pt-8 space-x-3 lg:col-span-1">
                <span className="text-lg font-medium text-gray-700">{t("Active")}:</span>
                <Switch 
                  handleClick={handleRoleStatus} 
                  checked={roleStatus}
                  srLabel={t("Toggle role active status")}
                />
              </div>
            </div>
      
            {/* Permissions Section */}
            <div className="space-y-2">
 
      
              {/* Select All Button */}
              <div className="flex items-center p-3 space-x-3 rounded-lg bg-blue-50">
                <input
                  type="checkbox"
                  id="select-all"
                  onChange={toggleSelectAll}
                  checked={areAllPermissionsSelected}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="select-all" className="text-lg font-semibold text-gray-800">
                  {t("SelectAllPermissions")}
                </label>
              </div>
      
              {/* Permissions Grid */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {Object.keys(permissionsData).map((category) => (
                  <div key={category} className="p-5 transition-shadow border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                    {/* Category Header */}
                    <div className="flex items-center pb-2 mb-4 space-x-3 border-b border-gray-100">
                      <input
                        type="checkbox"
                        id={`select-all-${category}`}
                        onChange={() => handleSelectAllCategory(category)}
                        checked={isAllSelectedInCategory(category)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`select-all-${category}`} 
                        className="text-xl font-semibold text-gray-800 capitalize"
                      >
                        {category.replace(/-/g, ' ')}
                      </label>
                    </div>
                    
                    {/* Permission Items */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {permissionsData[category].map((permission, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`permission-${category}-${index}`}
                            checked={selectedPermissions[category]?.includes(permission)}
                            onChange={() => handleTogglePermission(category, permission)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`permission-${category}-${index}`} 
                            className="font-medium text-gray-700"
                          >
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      
         <div className="flex items-center justify-end w-full gap-x-4" >
                      <div className="">
                        <StaticButton text={t('Reset')} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
                      </div>
                      <div className="">
                        <SubmitButton
                          text={t('Submit')}
                          rounded='rounded-full'
                          handleClick={handleRoleAdd}
                        />
                      </div>
          </div>
        </form>
      </section>
      )}
    </>
  );
};

export default EditRolePage;



