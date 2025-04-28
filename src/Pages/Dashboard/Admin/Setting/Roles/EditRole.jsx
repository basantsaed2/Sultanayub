import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  LoaderLogin,
  StaticButton,
  SubmitButton,
  Switch,
  TextInput,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { MultiSelect } from "primereact/multiselect";
import { useGet } from "../../../../../Hooks/useGet";

const EditRolePage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchRoles,
    loading: loadingRoles,
    data: dataRoles,
  } = useGet({
    url: `${apiUrl}/admin/admin_roles`,
  });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/admin_roles/update/${roleId}`,
  });

  const auth = useAuth();

  const [roleName, setRoleName] = useState("");
  const [permissionsData, setPermissionsData] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);
  const [roleStatus, setRoleStatus] = useState(0);

  // جلب الداتا من location.state
  useEffect(() => {
    if (location.state && location.state.roleData) {
      const { roleData } = location.state;
      console.log("roleData:", roleData);
      setRoleName(roleData.name || "");
      setRoleStatus(roleData.status || 0);

      const newSelectedPermissions = roleData.roles.map((item) => ({
        name: item.role,
      })) || [];
      setSelectedPermissions(newSelectedPermissions);

      const newSelectedActions = roleData.roles.flatMap((item) => {
        console.log("item:", item);
        const actions = Array.isArray(item.action)
          ? item.action
          : item.action
          ? [item.action]
          : [];
        return actions.map((action) => ({ name: action }));
      }) || [];
      setSelectedActions(newSelectedActions);
    }
  }, [location.state]);

  // جلب الـ permissions المتاحة من الـ API
  useEffect(() => {
    refetchRoles();
  }, [refetchRoles]);

  useEffect(() => {
    if (dataRoles) {
      console.log("Data Roles:", dataRoles);

      const newPermissionsData =
        dataRoles?.roles && typeof dataRoles.roles === "object"
          ? Object.entries(dataRoles.roles).map(([roleName, permissions]) => ({
              name: roleName,
              permissions: permissions,
            }))
          : [];
      setPermissionsData(newPermissionsData);
    }
  }, [dataRoles]);

  // تحديث availableActions بناءً على الـ Permissions المختارة
  useEffect(() => {
    if (Array.isArray(selectedPermissions) && Array.isArray(permissionsData)) {
      const actions = selectedPermissions.flatMap((permission) => {
        const found = permissionsData.find((p) => p.name === permission.name);
        return found ? found.permissions : [];
      });
      const uniqueActions = [...new Set(actions)];
      const newAvailableActions = uniqueActions.map((action) => ({
        name: action,
      }));
      setAvailableActions(newAvailableActions);
      console.log("availableActions:", newAvailableActions);
    }
  }, [selectedPermissions, permissionsData]);

  const handleRoleStatus = () => {
    setRoleStatus((prev) => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    if (response) {
      handleBack();
    }
  }, [response]);

  const handleBack = () => {
    navigate(-1, { replace: true });
  };

  const handleRoleEdit = (e) => {
    e.preventDefault();

    if (!roleName) {
      auth.toastError("Please enter a role name");
      return;
    }
    if (selectedPermissions.length === 0) {
      auth.toastError("Please select role permissions");
      return;
    }
    if (selectedActions.length === 0) {
      auth.toastError("Please select role actions");
      return;
    }

    const formData = new FormData();
    formData.append("name", roleName);
    formData.append("status", roleStatus);

    selectedPermissions.forEach((permission, index) => {
      formData.append(`roles[${index}][role]`, permission.name);
      const relatedActions = selectedActions
        .filter((action) => {
          const permissionData = permissionsData.find(
            (p) => p.name === permission.name
          );
          return (
            permissionData && permissionData.permissions.includes(action.name)
          );
        })
        .map((action) => action.name);
      relatedActions.forEach((action, actionIndex) => {
        formData.append(`roles[${index}][action][${actionIndex}]`, action);
      });
    });

    postData(formData, "Role updated successfully");
  };

  if (!permissionsData || permissionsData.length === 0) {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-TextFontMedium text-red-500">
          No permissions available
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Please check the API response or try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      {loadingRoles || loadingPost ? (
        <div className="w-full flex justify-center mb-96 pb-96 items-center py-10">
          <LoaderLogin className="w-10 h-10" />
        </div>
      ) : (
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleRoleEdit} className="space-y-10">
            
            {/* Fields Section */}
            <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Role Name */}
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Role Name:
                </label>
                <TextInput
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter Role Name"
                  className="w-[70%] !rounded-none text-sm border !border-gray-300  shadow-sm focus:ring-2 focus:ring-red-500"
                />
              </div>
  
              {/* Permissions */}
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Permissions:
                </label>
                <MultiSelect
                  value={selectedPermissions}
                  onChange={(e) => setSelectedPermissions(e.value)}
                  options={permissionsData}
                  optionLabel="name"
                  placeholder="Select Permissions"
                  maxSelectedLabels={3}
                  filter
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500"
                  panelClassName="text-sm"
                />
                {selectedPermissions.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-xs text-gray-600">
                    {selectedPermissions.map((permission, index) => (
                      <li key={index}>{permission.name}</li>
                    ))}
                  </ul>
                )}
              </div>
  
              {/* Actions */}
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Actions:
                </label>
                <MultiSelect
                  value={selectedActions}
                  onChange={(e) => setSelectedActions(e.value)}
                  options={availableActions}
                  optionLabel="name"
                  placeholder="Select Actions"
                  maxSelectedLabels={3}
                  filter
                  className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500"
                  panelClassName="text-sm"
                />
                {selectedActions.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-xs text-gray-600">
                    {selectedActions.map((action, index) => (
                      <li key={index}>{action.name}</li>
                    ))}
                  </ul>
                )}
              </div>
  
              {/* Role Status */}
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Active:
                </label>
                <div className="flex items-center gap-3">
                  <Switch
                    handleClick={handleRoleStatus}
                    checked={roleStatus}
                    className="scale-100"
                  />
                  <span className="text-sm text-gray-600">
                    {roleStatus ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
  
            {/* Buttons */}
            <div className="flex mb-96 pb-96  justify-center gap-6">
              <StaticButton
                text="Cancel"
                handleClick={handleBack}
                bgColor="bg-white"
                Color="text-red-600"
                border="border border-red-600"
                rounded="rounded-lg"
                className="px-8 py-2 text-sm font-semibold hover:bg-gray-50 transition"
              />
              <SubmitButton
                text="Save Changes"
                rounded="rounded-lg"
                handleClick={handleRoleEdit}
                className="px-8 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 transition text-white uppercase"
              />
            </div>
          </form>
        </section>
      )}
    </>
  );
  
};

export default EditRolePage;