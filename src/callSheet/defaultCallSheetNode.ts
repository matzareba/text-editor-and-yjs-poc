import { callSheetTableBlockType } from "../_blockNote/extensions/CallSheetTableExtension/consts";

export const defaultCallSheetNode = {
  type: callSheetTableBlockType,
  props: {
    textColor: "default",
    color: "red",
  },
  styles: {
    textColor: "gray",
  },
  content: {
    type: "tableContent",
    columnWidths: [null, 139, 284, 211, 154, null],
    headerRows: 1,
    rows: [
      {
        cells: [
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Start Time",
                styles: {
                  bold: true,
                },
                props: {
                  color: "green",
                },
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "gray",
              textColor: "default",
              textAlignment: "left",
              "data-type": "date",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Sets",
                styles: {
                  bold: true,
                  backgroundColor: "gray",
                },
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "gray",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Shot Description",
                styles: {
                  bold: true,
                },
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "gray",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Interview Subjects",
                styles: {
                  bold: true,
                },
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "gray",
              textColor: "default",
              textAlignment: "left",
              "data-type": "person",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Notes",
                styles: {
                  bold: true,
                },
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "gray",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Duration",
                styles: {
                  bold: true,
                },
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "gray",
              textColor: "default",
              textAlignment: "left",
              "data-type": "duration",
            },
          },
        ],
      },
      {
        cells: [
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "8:00 AM",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Set 1",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Shot Desc 1",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Darth Vader",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
              "data-type": "person",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Notes 1",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "30:00",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
        ],
      },
      {
        cells: [
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "8:30 AM",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Set 2",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Shot Desc 2",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Luke Skywalker",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
              "data-type": "person",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "Notes 2",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [
              {
                type: "text",
                text: "30:00",
                styles: {},
              },
            ],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "gray",
              textAlignment: "left",
            },
          },
        ],
      },
      {
        cells: [
          {
            type: "tableCell",
            content: [],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "default",
              textAlignment: "left",
              "data-type": "person",
            },
          },
          {
            type: "tableCell",
            content: [],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "default",
              textAlignment: "left",
            },
          },
          {
            type: "tableCell",
            content: [],
            props: {
              colspan: 1,
              rowspan: 1,
              backgroundColor: "default",
              textColor: "default",
              textAlignment: "left",
            },
          },
        ],
      },
    ],
  },
  children: [],
};
