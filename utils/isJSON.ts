function isJSON(obj: any) {
  try {
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch (e) {
    return false;
  }
}

export default isJSON;
