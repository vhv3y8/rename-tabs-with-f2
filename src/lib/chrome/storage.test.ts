// export const initialStorage =
//   typeof __TEST_MIGRATION__ === "undefined" || !__TEST_MIGRATION__
//     ? // initial value
//       {
//         settings: {
//           darkmode: false,
//           largerWidth: false,
//           shortcut: defaultShortcutF2,
//         },
//       }
//     : // for e2e storage migration test
//       {
//         settings: {
//           SomeNewBoolean: true,
//           SomeNewString: "hi",
//           darkmode: true,
//           largerWidth: true,
//           shortcut: {
//             ctrlKey: true,
//             altKey: true,
//             metaKey: true,
//             shiftKey: true,
//             key: "Q",
//           },
//         },
//       }
