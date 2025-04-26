import { useEffect, useState } from "react";
import {
  StaticButton,
  StaticLoader,
  SubmitButton,
  Switch,
  TextInput,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { MultiSelect } from "primereact/multiselect";

const AddRoleSection = ({ update, setUpdate, permissionRoles }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost } = usePost({
    url: `${apiUrl}/admin/admin_roles/add`,
  });
  const auth = useAuth();

  const [roleName, setRoleName] = useState("");
  const [permissionsData, setPermissionsData] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [roleStatus, setRoleStatus] = useState(0);
  const [availableActions, setAvailableActions] = useState([]);

  const handleRoleStatus = () => {
    setRoleStatus((prev) => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    if (permissionRoles && typeof permissionRoles === "object") {
      const formattedPermissions = Object.entries(permissionRoles).map(
        ([name, actionsArray]) => ({
          name,
          actions: Array.isArray(actionsArray) ? actionsArray : actionsArray.actions || [],
        })
      );
      setPermissionsData(formattedPermissions);
    }
  }, [permissionRoles]);

  useEffect(() => {
    const actions = selectedPermissions.flatMap((permission) => {
      const found = permissionsData.find((p) => p.name === permission.name);
      return found ? found.actions.map((act) => ({ permission: permission.name, name: act })) : [];
    });
    setAvailableActions(actions);
  }, [selectedPermissions, permissionsData]);

  useEffect(() => {
    setSelectedActions((prev) => {
      const updated = {};
      selectedPermissions.forEach((permission) => {
        if (prev[permission.name]) {
          updated[permission.name] = prev[permission.name];
        }
      });
      return updated;
    });
  }, [selectedPermissions]);

  const handleReset = () => {
    setRoleName("");
    setSelectedPermissions([]);
    setSelectedActions({});
    setRoleStatus(0);
  };

  const handleRoleAdd = (e) => {
    e.preventDefault();
  
    if (!roleName.trim()) {
      auth.toastError("Please enter a role name.");
      return;
    }
  
    if (selectedPermissions.length === 0) {
      auth.toastError("Please select at least one permission.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", roleName.trim());
    formData.append("status", roleStatus);
  
    selectedPermissions.forEach((permission, index) => {
      formData.append(`roles[${index}][role]`, permission.name);
  
      // تأكد من أن الأفعال تكون موجودة للشخصية الحالية
      const validActions = availableActions
        .filter((actionObj) => actionObj.permission === permission.name)
        .map((actionObj) => actionObj.name);
  
      const actions = (selectedActions[permission.name] || []).filter((act) =>
        validActions.includes(act)
      );
  
      // أضف الأفعال بشكل صحيح مع صيغة "action[]"
      actions.forEach((action) => {
        formData.append(`roles[${index}][action][]`, action);
      });
    });
  
    postData(formData, "Role Added Successfully");
    handleReset();
    setUpdate((prev) => !prev);
  };
  

  const handleActionsChange = (e) => {
    const updatedSelectedActions = {};

    // Loop through the selected actions and group them by their permission
    e.value.forEach((actionObj) => {
      if (!updatedSelectedActions[actionObj.permission]) {
        updatedSelectedActions[actionObj.permission] = [];
      }
      updatedSelectedActions[actionObj.permission].push(actionObj.name);
    });

    setSelectedActions(updatedSelectedActions);
  };

  return (
    <>
      {loadingPost ? (
        <div className="w-full h-56 flex justify-center items-center">
          <StaticLoader />
        </div>
      ) : (
        <section>
          <form onSubmit={handleRoleAdd}>
            <div className="sm:py-3 lg:py-6">
              <div className="w-full flex items-center justify-start gap-x-4">
                {/* Role Name Input */}
                <div className="w-[25%] flex flex-col gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Role Name:
                  </span>
                  <TextInput
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter Role Name"
                  />
                </div>

                {/* Permissions MultiSelect */}
                <div className="w-[25%] flex flex-col gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Permissions:
                  </span>
                  <MultiSelect
                    value={selectedPermissions}
                    onChange={(e) => setSelectedPermissions(e.value)}
                    options={permissionsData}
                    optionLabel="name"
                    placeholder="Select Permissions"
                    maxSelectedLabels={3}
                    className="w-full text-xl text-secoundColor font-TextFontRegular shadow-md rounded-[20px] mt-2 px-3 py-1"
                  />
                </div>

                {/* Actions MultiSelect */}
                <div className="w-[25%] flex flex-col gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Actions:
                  </span>
                  <MultiSelect
                    value={availableActions.filter((actionObj) => {
                      const selected = selectedActions[actionObj.permission] || [];
                      return selected.includes(actionObj.name);
                    })}
                    onChange={handleActionsChange}
                    options={availableActions}
                    optionLabel="name"
                    placeholder="Select Actions"
                    maxSelectedLabels={3}
                    className="w-full text-xl text-secoundColor font-TextFontRegular shadow-md rounded-[20px] mt-2 px-3 py-1"
                  />
                </div>

                {/* Role Status Switch */}
                <div className="w-[25%] flex items-center gap-x-2 pt-10">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Active:
                  </span>
                  <Switch handleClick={handleRoleStatus} checked={roleStatus} />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-[50%] m-auto flex justify-end gap-x-4 mt-4">
              <StaticButton
                text="Reset"
                handleClick={handleReset}
                bgColor="bg-transparent"
                Color="text-mainColor"
                border="border-2"
                borderColor="border-mainColor"
                rounded="rounded-full"
                className="px-4 py-2 text-base"
              />
              <SubmitButton
                text="Submit"
                rounded="rounded-full"
                handleClick={handleRoleAdd}
                className="px-4 py-2 text-base"
              />
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default AddRoleSection;
