/* eslint-disable no-unused-vars */
import React from "react";
import Select from "react-select";

function EditableSelectCell({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
  ...props
}) {

  const [value, setValue] = React.useState(initialValue[0]);
  const [isDarkMode, setIsDarkMode] = React.useState(localStorage.getItem('__theme_color').includes('dark'));
  const [isClicked, setIsClicked] = React.useState(false);

  const onChange = (data) => {
    setValue(data.value);
    updateMyData(index, id, data.value);
    setIsClicked(false)
    dataValue = data;
  };

  const onBlur = () => {
    // updateMyData(index, id, value);
    setIsClicked(false)
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const toggleSelectBox = () => {
    setIsClicked(true)
  };

  let returnValue = props.children.loopData.find((loop) => {
    return loop[props.children.loopLabel] === initialValue[0];
  })

  let dataValue = '';

  if (returnValue) {
    dataValue = returnValue;
  }

  if (isClicked) {
    return (
      <div style={{ width: "150px" }}>
        <Select
          className={isDarkMode ? "custom-select-add-dark" : ""}
          autoFocus={true}
          onChange={onChange}
          onBlur={onBlur}
          options={props.children.loopData.map((loop) => {
            return {
              label: loop[props.children.loopLabel],
              value: loop[props.children.loopValue]
            };
          })}
          value={{
            label: dataValue?.[props.children.loopLabel] || "NA",
            value: value,
          }}
        />
      </div>
    );
  } else {
    return (
      <p
        style={{ fontSize: "16px", width: "150px" }}
        onClick={props.children.isEdit ? toggleSelectBox : null}
        className={isDarkMode ? "dark-mode-fields" : ""}
      >
        { dataValue?.[props.children.loopLabel] || "NA"}
      </p>
    );
  }
}

export default EditableSelectCell;
