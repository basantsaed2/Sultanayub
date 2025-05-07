import { useEffect, useState } from "react";
import {
  StaticButton,
  StaticLoader,
  SubmitButton,
  Switch,
  TextInput,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useGet } from "../../../../../Hooks/useGet";
import { useAuth } from "../../../../../Context/Auth";
import { useNavigate } from "react-router-dom";
const AddRoleSection = ({ update, setUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchRoles, loading: loadingRoles, data: dataRoles } = useGet({
    url: `${apiUrl}/admin/admin_roles`
  });
  const { postData, loadingPost ,response} = usePost({
    url: `${apiUrl}/admin/admin_roles/add`,
  });
  const auth = useAuth();
  const nevigate =useNavigate()
  const [roleName, setRoleName] = useState('');
  const [permissionsData, setPermissionsData] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleStatus, setRoleStatus] = useState(0);

  useEffect(() => {
    refetchRoles();
  }, [refetchRoles, update]);

  useEffect(() => {
    if (dataRoles && dataRoles.roles) {
      console.log('dataRoles', dataRoles.roles)
      const permissions = dataRoles.roles;
      setPermissionsData(permissions);

      // Initialize selected permissions state
      const initialSelected = {};
      Object.keys(permissions).forEach((category) => {
        initialSelected[category] = [];
      })
      setSelectedPermissions(initialSelected)
    }
  }, [dataRoles]);

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
    if (selectedPermissions[category].length === permissionsData[category].length) {
      // Deselect all in the category
      setSelectedPermissions((prev) => ({
        ...prev,
        [category]: [],
      }));
    } else {
      // Select all in the category
      setSelectedPermissions((prev) => ({
        ...prev,
        [category]: [...permissionsData[category]],
      }));
    }
  };

  // Check if all permissions are selected in a category
  const isAllSelectedInCategory = (category) =>
    selectedPermissions[category]?.length === permissionsData[category]?.length;


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
  const areAllPermissionsSelected = Object.values(selectedPermissions).every(
    (permissions, index) => permissions.length === Object.values(permissionsData)[index]?.length
  );

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
      auth.toastError("Please enter a role name.");
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
      auth.toastError("Please select at least one permission.");
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
  
    postData(formData, "Role Added Successfully");
  };

  return (
    <>
      {loadingPost || loadingRoles ? (
        <div className="w-full h-56 flex justify-center items-center">
          <StaticLoader />
        </div>
      ) : (
        <section className="bg-white rounded-xl shadow-lg p-6 mb-20">
        <form onSubmit={handleRoleAdd} className="space-y-4">
          <div className="space-y-4">
            {/* Role Name Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-1 space-y-2">
                <label htmlFor="role-name" className="block text-lg font-medium text-gray-700">
                  Role Name:
                </label>
                <TextInput
                  id="role-name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter Role Name"
                  className="w-full"
                />
              </div>
      
              {/* Active Toggle */}
              <div className="lg:col-span-1 flex items-center space-x-3 pt-8">
                <span className="text-lg font-medium text-gray-700">Active:</span>
                <Switch 
                  handleClick={handleRoleStatus} 
                  checked={roleStatus}
                  srLabel="Toggle role active status"
                />
              </div>
            </div>
      
            {/* Permissions Section */}
            <div className="space-y-2">
 
      
              {/* Select All Button */}
              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="select-all"
                  onChange={toggleSelectAll}
                  checked={areAllPermissionsSelected}
                  className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="select-all" className="text-lg font-semibold text-gray-800">
                  Select All Permissions
                </label>
              </div>
      
              {/* Permissions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {Object.keys(permissionsData).map((category) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    {/* Category Header */}
                    <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-gray-100">
                      <input
                        type="checkbox"
                        id={`select-all-${category}`}
                        onChange={() => handleSelectAllCategory(category)}
                        checked={isAllSelectedInCategory(category)}
                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`select-all-${category}`} 
                        className="text-xl font-semibold text-gray-800 capitalize"
                      >
                        {category.replace(/-/g, ' ')}
                      </label>
                    </div>
                    
                    {/* Permission Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissionsData[category].map((permission, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`permission-${category}-${index}`}
                            checked={selectedPermissions[category]?.includes(permission)}
                            onChange={() => handleTogglePermission(category, permission)}
                            className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`permission-${category}-${index}`} 
                            className="text-gray-700 font-medium"
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
      
         <div className="w-full flex items-center justify-end gap-x-4" >
                      <div className="">
                        <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
                      </div>
                      <div className="">
                        <SubmitButton
                          text={'Submit'}
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

export default AddRoleSection;
