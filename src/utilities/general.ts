import fs, { promises } from "fs";
import path from "path";
import { APP_CONFIG } from "../config/appConfig";
import { Params } from "../interfaces/DBQueryInterface";

export const sanitizeUpdate = (
  data: any,
  disallowed = ["password", "role"]
) => {
  const copy = { ...data };
  disallowed.forEach((key) => delete copy[key]);
  return copy;
};

export const avatarPath = (avatar: string | null | undefined) => {
  const baseUrl = APP_CONFIG.appUrl || "";
  const baseAvatarFolder = APP_CONFIG.misc.baseAvatarFolder || "";
  const defaultProfileImageUrl = APP_CONFIG.misc.defaultProfileImageUrl || "";
  return (
    baseUrl + (avatar ? baseAvatarFolder + avatar : defaultProfileImageUrl)
  );
};

export async function createDirectory(dirPath: string): Promise<void> {
  try {
    await promises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error creating directory: ${error.message}`);
    } else {
      // Handle cases where the error is not a standard Error object
      console.error("An unknown error occurred.");
    }
    throw error;
  }
}

export const prepareRouteParams = (params: any): Params => {
  return {
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
    sort: params.sort ?? "id",
    order: params.order === "asc" ? "asc" : "desc",
    search: params.search ?? "",
  };
};

export const deleteFile = (filename: string, subdirectory: string): Boolean => {
  if (!filename) {
    return false;
  }
  const postImage = path.join(
    __dirname,
    `../public/uploads/${subdirectory}/${filename}`
  );
  if (fs.existsSync(postImage)) {
    fs.unlinkSync(postImage);
  }
  return true;
};

export const validatorMappedErrors = (errors: { [key: string]: any }) => {
  const errorsArray = [];
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errorsArray.push({
        field: key,
        message: errors[key].msg,
      });
    }
  }
  return errorsArray;
};
