import React, { Fragment } from "react";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
function DatePicker(props) {
  const { label, name, ...rest } = props;
  return (
    <Fragment>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <DateView
              id={name}
              {...field}
              {...rest}
              selected={moment(value)}
              onChange={(val) => setFieldValue(name, val)}
            />
          );
        }}
      </Field>
    </Fragment>
  );
}

export default DatePicker;
