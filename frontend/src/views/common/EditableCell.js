import React from "react";

function EditableCell({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) {

  const [value, setValue] = React.useState(initialValue);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onBlur = () => {
    updateMyData(index, id, value);
  };
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <input
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}

export default EditableCell;
