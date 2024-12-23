import { FormData } from "@/types/form-entry";

interface InputFieldProps {
  name: string;
  value: string;
  placeholder?: string;
  type?: "NUMBER" | "TEXT" | "DATE" | "TEXTAREA";
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  placeholder,
  type = "TEXT",
  formData,
  setFormData,
}) => {
  const splittedName = name.split(" ");
  const fieldName = splittedName.map((name: string, index: number) =>
    index === 0
      ? name.toLowerCase()
      : name.charAt(0).toUpperCase() + name.substring(1)
  ).join("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (type === "NUMBER") {
      const sanitizedValue = value.replace(/[^0-9/]/g, "");
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {name}
      </label>
      {type === "TEXTAREA" ? (
        <textarea
          className="border border-gray-300 rounded-md p-2 text-sm w-full max-h-28 resize-none"
          value={value.trim()}
          readOnly
        />
      ) : (
        <input
          type={type === "DATE" ? "date" : "text"}
          name={fieldName}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
        />
      )}
    </div>
  );
};
