import axios from "axios";
import { smartsightAPI } from "../constants/defaultValues";

export default axios.create({
  baseURL: smartsightAPI
});
