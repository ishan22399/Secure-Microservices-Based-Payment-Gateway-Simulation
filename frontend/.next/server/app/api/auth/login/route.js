/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n// Mock user database\nconst users = [\n    {\n        id: \"1\",\n        email: \"customer@demo.com\",\n        password: \"demo123\",\n        name: \"John Customer\",\n        role: \"customer\",\n        permissions: [\n            \"view_transactions\",\n            \"make_payments\"\n        ]\n    },\n    {\n        id: \"2\",\n        email: \"merchant@demo.com\",\n        password: \"demo123\",\n        name: \"Jane Merchant\",\n        role: \"merchant\",\n        merchantId: \"MERCH_001\",\n        permissions: [\n            \"view_transactions\",\n            \"manage_payments\",\n            \"view_analytics\"\n        ]\n    },\n    {\n        id: \"3\",\n        email: \"admin@demo.com\",\n        password: \"demo123\",\n        name: \"Admin User\",\n        role: \"bank_admin\",\n        bankId: \"BANK_001\",\n        permissions: [\n            \"full_access\",\n            \"manage_users\",\n            \"system_admin\"\n        ]\n    }\n];\nasync function POST(request) {\n    try {\n        const { email, password } = await request.json();\n        // Find user\n        const user = users.find((u)=>u.email === email && u.password === password);\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid credentials\"\n            }, {\n                status: 401\n            });\n        }\n        // Generate mock JWT token\n        const token = `mock_jwt_token_${user.id}_${Date.now()}`;\n        // Return user data (excluding password)\n        const { password: _, ...userWithoutPassword } = user;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: userWithoutPassword,\n            token\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNEQ7QUFFNUQscUJBQXFCO0FBQ3JCLE1BQU1DLFFBQVE7SUFDWjtRQUNFQyxJQUFJO1FBQ0pDLE9BQU87UUFDUEMsVUFBVTtRQUNWQyxNQUFNO1FBQ05DLE1BQU07UUFDTkMsYUFBYTtZQUFDO1lBQXFCO1NBQWdCO0lBQ3JEO0lBQ0E7UUFDRUwsSUFBSTtRQUNKQyxPQUFPO1FBQ1BDLFVBQVU7UUFDVkMsTUFBTTtRQUNOQyxNQUFNO1FBQ05FLFlBQVk7UUFDWkQsYUFBYTtZQUFDO1lBQXFCO1lBQW1CO1NBQWlCO0lBQ3pFO0lBQ0E7UUFDRUwsSUFBSTtRQUNKQyxPQUFPO1FBQ1BDLFVBQVU7UUFDVkMsTUFBTTtRQUNOQyxNQUFNO1FBQ05HLFFBQVE7UUFDUkYsYUFBYTtZQUFDO1lBQWU7WUFBZ0I7U0FBZTtJQUM5RDtDQUNEO0FBRU0sZUFBZUcsS0FBS0MsT0FBb0I7SUFDN0MsSUFBSTtRQUNGLE1BQU0sRUFBRVIsS0FBSyxFQUFFQyxRQUFRLEVBQUUsR0FBRyxNQUFNTyxRQUFRQyxJQUFJO1FBRTlDLFlBQVk7UUFDWixNQUFNQyxPQUFPWixNQUFNYSxJQUFJLENBQUMsQ0FBQ0MsSUFBTUEsRUFBRVosS0FBSyxLQUFLQSxTQUFTWSxFQUFFWCxRQUFRLEtBQUtBO1FBRW5FLElBQUksQ0FBQ1MsTUFBTTtZQUNULE9BQU9iLHFEQUFZQSxDQUFDWSxJQUFJLENBQUM7Z0JBQUVJLE9BQU87WUFBc0IsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQzNFO1FBRUEsMEJBQTBCO1FBQzFCLE1BQU1DLFFBQVEsQ0FBQyxlQUFlLEVBQUVMLEtBQUtYLEVBQUUsQ0FBQyxDQUFDLEVBQUVpQixLQUFLQyxHQUFHLElBQUk7UUFFdkQsd0NBQXdDO1FBQ3hDLE1BQU0sRUFBRWhCLFVBQVVpQixDQUFDLEVBQUUsR0FBR0MscUJBQXFCLEdBQUdUO1FBRWhELE9BQU9iLHFEQUFZQSxDQUFDWSxJQUFJLENBQUM7WUFDdkJDLE1BQU1TO1lBQ05KO1FBQ0Y7SUFDRixFQUFFLE9BQU9GLE9BQU87UUFDZCxPQUFPaEIscURBQVlBLENBQUNZLElBQUksQ0FBQztZQUFFSSxPQUFPO1FBQXdCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzdFO0FBQ0YiLCJzb3VyY2VzIjpbIkk6XFxmcm9udGVuZFxcYXBwXFxhcGlcXGF1dGhcXGxvZ2luXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlIE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuXG4vLyBNb2NrIHVzZXIgZGF0YWJhc2VcbmNvbnN0IHVzZXJzID0gW1xuICB7XG4gICAgaWQ6IFwiMVwiLFxuICAgIGVtYWlsOiBcImN1c3RvbWVyQGRlbW8uY29tXCIsXG4gICAgcGFzc3dvcmQ6IFwiZGVtbzEyM1wiLFxuICAgIG5hbWU6IFwiSm9obiBDdXN0b21lclwiLFxuICAgIHJvbGU6IFwiY3VzdG9tZXJcIixcbiAgICBwZXJtaXNzaW9uczogW1widmlld190cmFuc2FjdGlvbnNcIiwgXCJtYWtlX3BheW1lbnRzXCJdLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiMlwiLFxuICAgIGVtYWlsOiBcIm1lcmNoYW50QGRlbW8uY29tXCIsXG4gICAgcGFzc3dvcmQ6IFwiZGVtbzEyM1wiLFxuICAgIG5hbWU6IFwiSmFuZSBNZXJjaGFudFwiLFxuICAgIHJvbGU6IFwibWVyY2hhbnRcIixcbiAgICBtZXJjaGFudElkOiBcIk1FUkNIXzAwMVwiLFxuICAgIHBlcm1pc3Npb25zOiBbXCJ2aWV3X3RyYW5zYWN0aW9uc1wiLCBcIm1hbmFnZV9wYXltZW50c1wiLCBcInZpZXdfYW5hbHl0aWNzXCJdLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiM1wiLFxuICAgIGVtYWlsOiBcImFkbWluQGRlbW8uY29tXCIsXG4gICAgcGFzc3dvcmQ6IFwiZGVtbzEyM1wiLFxuICAgIG5hbWU6IFwiQWRtaW4gVXNlclwiLFxuICAgIHJvbGU6IFwiYmFua19hZG1pblwiLFxuICAgIGJhbmtJZDogXCJCQU5LXzAwMVwiLFxuICAgIHBlcm1pc3Npb25zOiBbXCJmdWxsX2FjY2Vzc1wiLCBcIm1hbmFnZV91c2Vyc1wiLCBcInN5c3RlbV9hZG1pblwiXSxcbiAgfSxcbl1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKClcblxuICAgIC8vIEZpbmQgdXNlclxuICAgIGNvbnN0IHVzZXIgPSB1c2Vycy5maW5kKCh1KSA9PiB1LmVtYWlsID09PSBlbWFpbCAmJiB1LnBhc3N3b3JkID09PSBwYXNzd29yZClcblxuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBjcmVkZW50aWFsc1wiIH0sIHsgc3RhdHVzOiA0MDEgfSlcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBtb2NrIEpXVCB0b2tlblxuICAgIGNvbnN0IHRva2VuID0gYG1vY2tfand0X3Rva2VuXyR7dXNlci5pZH1fJHtEYXRlLm5vdygpfWBcblxuICAgIC8vIFJldHVybiB1c2VyIGRhdGEgKGV4Y2x1ZGluZyBwYXNzd29yZClcbiAgICBjb25zdCB7IHBhc3N3b3JkOiBfLCAuLi51c2VyV2l0aG91dFBhc3N3b3JkIH0gPSB1c2VyXG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgdXNlcjogdXNlcldpdGhvdXRQYXNzd29yZCxcbiAgICAgIHRva2VuLFxuICAgIH0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW50ZXJuYWwgc2VydmVyIGVycm9yXCIgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwidXNlcnMiLCJpZCIsImVtYWlsIiwicGFzc3dvcmQiLCJuYW1lIiwicm9sZSIsInBlcm1pc3Npb25zIiwibWVyY2hhbnRJZCIsImJhbmtJZCIsIlBPU1QiLCJyZXF1ZXN0IiwianNvbiIsInVzZXIiLCJmaW5kIiwidSIsImVycm9yIiwic3RhdHVzIiwidG9rZW4iLCJEYXRlIiwibm93IiwiXyIsInVzZXJXaXRob3V0UGFzc3dvcmQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=I%3A%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=I%3A%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=I%3A%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=I%3A%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var I_frontend_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"I:\\\\frontend\\\\app\\\\api\\\\auth\\\\login\\\\route.ts\",\n    nextConfigOutput,\n    userland: I_frontend_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj1JJTNBJTVDZnJvbnRlbmQlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUklM0ElNUNmcm9udGVuZCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDSDtBQUMxRTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiSTpcXFxcZnJvbnRlbmRcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXGxvZ2luXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9sb2dpblwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkk6XFxcXGZyb250ZW5kXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxsb2dpblxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=I%3A%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=I%3A%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=I%3A%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=I%3A%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();