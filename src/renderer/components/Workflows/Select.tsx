// import Select from "react-tailwindcss-select";

// const options = [
//   { value: "fox", label: "🦊 Fox" },
//   { value: "Butterfly", label: "🦋 Butterfly" },
//   { value: "Honeybee", label: "🐝 Honeybee" },
// ];

export interface IOption {
  value: string
  label: string
  disabled?: boolean
  isSelected?: boolean
}

interface ISelectElement {
  options: IOption[]
  placeholder?: string
  isDisabled?: boolean
}

export const SelectComponent = (props: ISelectElement) => {
  // const [value, setValue] = useState(null);

  // const handleChange = (value: any) => {

  //   setValue(value);
  // };

  return (
    <p>SELECT</p>
    // <Select
    /* classNames={{
        menuButton: (state) => "flex text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20",
        menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
        listItem: ({isSelected}) => "list-none py-1.5 px-2 hover:bg-blue-500 rounded-md hover:text-white cursor-pointer"
      }} */
    // value={value}
    // onChange={handleChange}
    // options={props.options}
    // primaryColor={""}
    // primaryColor={"indigo"}
    // isClearable
    // isSearchable
    // isDisabled
    /* formatGroupLabel={(data) => (
        <div className={`py-2 text-xs flex items-center justify-between`}>
          <span className="font-bold">{data.label}</span>
          <span className="bg-gray-200 h-5 h-5 p-1.5 flex items-center justify-center rounded-full">{data.options.length}</span>
        </div>
      )} */
    // />
  )
}
