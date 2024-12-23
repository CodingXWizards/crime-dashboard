import { FormData } from "@/types/form-entry";
import Select from "react-select";

interface DropDownProps {
  name: string;
  value: string;
  fieldName: string;
  data: { label: string; value: string }[];
  disabled?: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    maxHeight: "200px", // Set maximum height for dropdown
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "200px", // Set maximum height for the scrollable area
  }),
};

export const DropDown: React.FC<DropDownProps> = ({
  name,
  value,
  data,
  fieldName,
  disabled = false,
  formData,
  setFormData,
}) => {
  const handleSelectChange = (
    selectedOption: { label: string; value: string } | null,
  ) => {
    setFormData({ ...formData, [fieldName as keyof FormData]: selectedOption?.value || "" });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {name}
      </label>
      <Select
        options={data}
        value={data.find((option) => option.value === value)}
        onChange={(selectedOption) =>
          handleSelectChange(selectedOption)
        }
        isDisabled={disabled}
        placeholder={`Select ${name}`}
        className="mt-1"
        styles={customStyles}
      />
    </div>
  );
};
