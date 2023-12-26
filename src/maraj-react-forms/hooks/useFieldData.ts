import { useContext } from "react";
import { FieldContext } from "../context";

export const useFieldData = () => useContext(FieldContext)?.fieldData
