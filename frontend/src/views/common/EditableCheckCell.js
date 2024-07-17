import React from "react";

function EditableCheckCell({
	value: initialValue,
	row: { index },
	column: { id },
	updateMyData,
}) {
	const [value, setValue] = React.useState(initialValue);
	const onChange = (e) => {
		setValue(prevstate=>!prevstate);
	};
	const onBlur = () => {
		updateMyData(index, id, value);
	};
	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);
	return (
		<input
			type="checkbox"
			defaultChecked={value}
			onChange={onChange}
			onBlur={onBlur}
		/>
	);
}

export default EditableCheckCell;
