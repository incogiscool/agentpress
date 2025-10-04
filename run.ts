/*




BELOW IS THE CODE USED IN THE PROOF OF CONCEPT, ADJUST INTO PACKAGE




*/

// import fs from "fs";
// import path from "path";
// import z from "zod";

// const apiDir = path.join(__dirname, "src/app/api");

// function findRouteFiles(dir: string): string[] {
//   let results: string[] = [];
//   const list = fs.readdirSync(dir);
//   for (const file of list) {
//     const filePath = path.join(dir, file);
//     const stat = fs.statSync(filePath);
//     if (stat && stat.isDirectory()) {
//       results = results.concat(findRouteFiles(filePath));
//     } else if (file === "route.ts") {
//       results.push(filePath);
//     }
//   }
//   return results;
// }

// function getMethodsFromJson(routeFilePath: string): string | null {
//   const dir = path.dirname(routeFilePath);
//   const jsonPath = path.join(dir, "methods.json");
//   if (fs.existsSync(jsonPath)) {
//     const content = fs.readFileSync(jsonPath, "utf8");
//     try {
//       return JSON.parse(content);
//     } catch {
//       return null;
//     }
//   }
//   return null;
// }

// const routeFiles = findRouteFiles(apiDir);
// // console.log(routeFiles);
// const results = (
//   await Promise.all(
//     routeFiles.map(async (file) => {
//       const md = await import(file);
//       if (!md.methods) return null;
//       const methods = md.methods?.map((method) => {
//         // console.log(method);
//         if (method.params) {
//           return {
//             ...method,
//             params: z.toJSONSchema(method?.params),
//           };
//         }

//         return method;
//       });

//       // console.log(methods);
//       // Get the relative path from apiDir, remove "route.ts", and convert to web path
//       const relativePath = path.relative(apiDir, file);
//       const webPath =
//         "/api/" + relativePath.replace(/\/?route\.ts$/, "").replace(/\\/g, "/");
//       return {
//         pathname: webPath === "/" ? "/" : webPath, // root route
//         methods,
//       };
//     })
//   )
// ).filter((route) => route !== null);

// // console.log(results.filter((route) => route !== null));

// fetch("http://localhost:3000/api/methods", {
//   method: "POST",
//   body: JSON.stringify(results),
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: process.env.AGENTPRESS_SECRET_KEY!,
//   },
// })
//   .then((res) => {
//     console.log("Methods uploaded successfully", res);
//   })
//   .catch((err) => {
//     console.log("Error uploading methods:", err);
//   });
