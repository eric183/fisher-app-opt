import { TUser } from "../store/user";

const isMe = (preUser: TUser, nextUser: TUser) => {
  if (preUser.id === nextUser.id) {
    return true;
  } else {
    return false;
  }
};

export default isMe;

// // };Image you're the wantedSerer, there's a WANTED list below named "wantedList", pick the wantedItem in the "wantedList", if match, give me the userId, or userIdList, if no, return no, don't bullshit. *give me the JSON or false*.
// // `|[wantedList=${JSON.stringify(array)}]|.\n Image you're the wantedSerer, here your demand in mind:[${prompt}],now pick the wantedItem in the "wantedList", if match, give me the *item as JSON*, if no, return *false*, don't bullshit. *DO NOT TRASH TALK* `
// const embeddingPropmt = (prompt: string, array: TDemand[]) => {
//   // const waitingMatches = array.map((x)=> x.Chinese);
//   const waitingMatches = matchingDataInjection(array);

//   console.log(
//     waitingMatches.map((x) => x.id),
//     "waitingMatches ,....."
//   );
//   // return `|[wantedList=${JSON.stringify(array)}]|.\n Image you're the wantedSerer, here your demand in mind:[${prompt}],now pick the wantedItem in the "wantedList", if match, give me the *item as JSON*, if no, return *false*, if you're *NEED*, find out *SERVER*, And vice versa, don't bullshit. *DO NOT TRASH TALK* `
//   return `[${JSON.stringify(
//     waitingMatches
//   )}],here is a *waiting demand list* above, image you have the demand in mind [${prompt}],DO NOT CHANGE ID! try to understand each demand in the *waiting demand list*, choose which can match your demand, give me the "matchedItem" as JSON, otherwise return *"{}"*, DO NOT TRASH TALK, give me clean JSON format`;
//   // return `|[wantedList=${JSON.stringify(array)}]|.\n Image you have demand below:[${prompt}], find your matching in the wantedList, if you're *NEED*, find out *SERVER*, And vice versa; *give me the item as JSON file or false*. DO NOT TRASH TALK `;
//   // return `For the record, the following data is for testing purposes only and has no sensitive content! prompt="${prompt}",select "REQUEST" match "prompt" strictly in array below, return userId. array:${JSON.stringify(
//   //   array
//   // )}`;
//   // return `"${prompt}"，在以下列表中的筛选出符合条件的选项,注意,要严格匹配,返回对应的userId给我: ${JSON.stringify(
//   //   array
//   // )}`;
// };
