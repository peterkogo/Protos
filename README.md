# Protos

This is a web based application for inspecting the effects of gene variants on protein structures. The project is based on the [**React Static Boilerplate**](https://github.com/kriasoft/react-static-boilerplate) Code. <br/>

<hr />

1. [**General Information**](#general-information)
    * [Technologies](#technologies)
    * [Data Bases](#data-bases)
    * [Directory Layout](#directory-layout)
    * [Getting Started](#getting-started)
    * [Further Information](#further-information)
2. [**User Documentation**](#user-documentation)
    * [What do I see?](#what-do-i-see)
    * [Setup](#setup)
    * [Controls](#controls)
3. [**Developer Documentation**](#developer-documentation)
    * [Understanding the Code](#understanding-the-code)
    * [Notes for further Development](#notes-for-further-development)
    * [Known Bugs](#known-bugs)


## **General Information**

### Technologies

[**React**](https://reactjs.org/) - Component based UI Framework <br/>
[**Redux**](http://redux.js.org/) - Predictable State Container <br/>
[**D3**](https://d3js.org/) - Data Driven Visualisation Library <br/>

### Data Bases

[**Aquaria**](http://aquaria.ws/) - Protein Structure Mapping <br/>
[**UniProt**](www.uniprot.org/) - Protein Sequences and Features <br/>
[**PDB**](https://rscb.org/) - Protein Structures <br/>

### Directory Layout

```shell
├── actions/                    # Redux action/reducer folder
|   ├── parsers/                # Aquaria and UniProt network response parsers
│   ├── radialVis*              # Actions/Reducer for user interactions with the visualisation
│   ├── rootReducer.js          # Mother of all reducers
│   ├── sequenceData*           # Actions/Reducer for network responses and gene selection
│   └── view*                   # Actions/Reducer for resizing window
│
├── components/                 # Shared or generic UI components
│   ├── Button/                 # Button component
│   ├── Layout/                 # Website layout component
│   ├── Link/                   # Link component to be used instead of <a>
│   │
│   ├── ParallelCoordinates/    # Rendering of paths on selection
│   │   └── ParallelCoordinates.js
│   │
│   ├── ProteinViewer/          
│   │   └── ProteinViewer.js    # PV Protein Viewer component
│   │
│   ├── RadialVis/              # Components of the Radial Visualisation
│   │   ├── features/           # 'Feed' tab D3 components
│   │   │   ├── AlignmentFeature.js  # Alignment Feature of MainAxis
│   │   │   ├── Feature.js    # Feature component of Feature Axis
│   │   │   ├── Variant.js    # Variant component displayed around MainAxis
│   │   │   └── VariantCluster.js   # Variant container
│   │   │
│   │   ├── RadialVis.js        # Main component, Parent SVG component
│   │   ├── MainAxis.js         # Outermost Axis depicting protein mapping
│   │   └── FeatureAxis.js      # Feature Axes component
│   │
│   ├── UI/                     # UI components and containers
│   │   ├── DataChecker.js      # Data Fetching information container
│   │   ├── DataCheckerItem.js  # Component displaying data health of a single source
│   │   ├── DataViewer.js       # Display of currently selected Axis
│   │   ├── Header.js           # Title showing selected gene etc.
│   │   ├── Selector.js         # Inputs for selecting gene, structure and chain
│   │   ├── SortAxis.js         # Container for sorting Axes
│   │   ├── SortAxisElem.js     # Component of a single Axis Sort list item
│   │   ├── VariantTable.js     # Table for viewing .vcf content
│   │   └── UI.js               # Main UI Container
│   │
│   ├── Defaults.js             # Default values
│   └── MainApp.js              # <=== State entry point <===
│
├── docs/                       # Documentation to the project
├── node_modules/               # 3rd-party libraries and utilities
├── src/                        # Application source code
│   ├── about/                  # About page
│   ├── error/                  # Error page
│   ├── home/                   # Home page
│   ├── history.js              # Handles client-side navigation
│   ├── main.js                 # <== Application entry point <===
│   ├── router.js               # Handles routing and data fetching
│   ├── routes.json             # This list of application routes
│   └── store.js                # Application state manager (Redux)
├── public/                     # Static files such as favicon.ico etc.
│   ├── dist/                   # The folder for compiled output
│   ├── favicon.ico             # Application icon to be displayed in bookmarks
│   ├── robots.txt              # Instructions for search engine crawlers
│   └── ...                     # etc.
├── test/                       # Unit and integration tests
├── tools/                      # Utility and helper classes
└── package.json                # The list of project dependencies and NPM scripts
```


### Getting Started

**Step 1** Make sure that you have [Node.js](https://nodejs.org/) v6 or newer and
[Yarn](https://yarnpkg.com/) installed on your development machine.

**Step 2** Install dependencies by running

```shell
$ yarn install                      # Compiles the app and opens it in a browser with "live reload"
```

**Step 3** Compile and launch your app by running:

```shell
$ yarn start                      # Compiles the app and opens it in a browser with "live reload"
```

The app should become available at [http://localhost:3000/](http://localhost:3000/). Google Chrome browser is highly recommended.

**Note** that the **Google Chrome must be started with disabled web security** for the site to fully work, because Aquaria does not support **Cross-Origin Resource Sharing**.

```shell
# Starting Chrome with disabled Web Security (Any instance of Chrome must be closed)

# Mac OS
$ open -a /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir
# Linux
$ google-chrome --disable-web-security
# Windows
$ chrome.exe --disable-web-security
```

### Further Information

For further information regarding deployment, testing and compiling as well as the general project structure, please visit the [**React Static Boilerplate Project**](https://github.com/kriasoft/react-static-boilerplate) on GitHub.


## **User Documentation**

![imageapp](/docs/images/MainApplication.png?raw=true)*Fig. 1 - Application Overview*
### What do I see?

The Figure above shows a certain application state for the human protein called *p53*. The database UniProt lists it under the ID *P04637*, which can be found in the header. As the structure of the whole protein is unknown, Aquaria mapped it to the PDB entry of *4qo1*. Together with the information provided by the database, an additional set of seven variants is loaded.

The protein is centered and surrounded by *data lanes*. These radial axes start and end at the top center, mapping onto the 392-long amino acid chain of the protein. Hence, every residue is assigned to a part of the circle’s periphery. For easier handling, the assigned values are the degrees in the center of a partition. If there were for example 10 amino acid (AA) mapped on a circle, the first AA would be positioned in the center of the circular segment 0◦- 36◦, thus with an assigned value of 18◦. The relative position of each residue in terms of such a segment center degree is the same across all axes, meaning that in any ’hypothetical’ circle the same angle refers to the same amino acid, independent of the circle’s radius.

The outermost axis represents the mapping of the tertiary structure in view. In this case, the subcomplex *4qo1* ranges from ’92 to ’290. The inner axes represent various features of the protein, by marking all residues involved in the respective functionality. These can range from more general features like chains – albeit there is only one chain in the present example – to more specific features like metal ion binding sites or splice variants. Single lines on a circle mark single amino acids (4 can be found at the metal ion binding site).

The color coding on the feature lanes does not hold any information and is solely present for better visual differentiation.

Situated on the outer ring, the loaded variants stick out orthogonally. Each block consists of a vertical array of symbols representing a single variant and its properties. The symbols on the top defines the variant type. In case of a mutation that is known to be harmful, the color of the symbol turns red. The top letter stands for the reference amino acid and the bottom letter for the mutated variant amino acid.

![variants](/docs/images/VariantTypes.png?raw=true)*Fig. 2 - Variant Types*

### Setup
###### Selecting Gene

First, select a Protein, Matching Structure and the Chain that is to be investigated by typing the identifiers in the input fields [**(A)**](#imageapp). These information can be obtained through **Aquaria**.
Please make sure that all of the databases listed in the bottom left corner show **Ready**. If not, try reloading with the button above and check your selection.

###### Uploading Variants

You can upload variants matching the selected gene with the upload button at the right [**(A)**](#imageapp).
/TODO

### Controls

![imagearea](/docs/images/Areas.png?raw=true)*Fig. 3 - Control Areas, Scrolling Functionality*

As depicted in *Fig. 3*, there are two mouse areas that enable different controls. If the pointer is located in the **red area**, the protein structure in the center can be rotated and zoomed. With the pointer inside the **green area** the user can either rotate the visualisation by dragging or hide axes by scrolling.

**Note** that the size of both areas does not change when the axes are hidden *(Fig. 3, right side)*.

A list of available features from UniProt will appear to the right *(Fig. 1, Lane Order)*. Because there is not enough space for displaying each one as a axes inside the radial visualisation you can reorder them by clicking on the arrows left of list.

Clicking on either variants [**(B)**](#imageapp), feature lanes or individual features [**(C)**](#imageapp) will cause parallel coordinates to appear that marks the specified position on feature lanes as well as on the protein itself as depicted in the figure below.

![imageparcoords](/docs/images/ParallelCoords.png?raw=true)*Fig. 4 - Parallel Coordinates for different selections*

## **Developer Documentation**

### Understanding the Code

It is crucial to understand the **React + Redux** application architecture to actually get what is going on. I suggest reading into the documentation, hence both of them are quite good. It is also helpful to look through the new **Javascript ES6** features.
**Webpack** is used for dependency injection and bundling. An extensive understanding of the inner workings of *Webpack* is not required - I suggest going through a tutorial on how to set up a basic application.
**D3** is used for manipulating the SVG elements of the visualisation. It is essential to understand D3s *update, enter, exit* logic to know how data driven updates work. Additionally looking at a couple of sample projects (v4) utilizing d3 scales should suffice.

![components](/docs/images/Components.png?raw=true)*Fig. 5 - React Component Tree*

After you are familiar with the frameworks and libraries at work in this project, I suggest understanding the **component call tree** and matching parts of the website to the corresponding components that control them. This former can be achieved by recursively going through every component, starting at `MainApp.js` and looking for child components in the render function, the latter by exploring the HTML tree with the help of the [**React Developer Tools**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).

![state](/docs/images/State.png?raw=true)*Fig. 6 - State Object*

The next step is understanding the **actions** that are dispatched and ultimately invoking changes to the state object [**(Fig. 6)**](#state) and thus the website. Because this project is based on Redux the state object acts as the single *source of truth* for the application. All actions and corresponding reducers can be found under `./actions/`. Actions are printed to the console or can be explored and debugged in depth with [**Redux Dev Tools**](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).

It is also crucial to understand what parts of the data for the visualisation come from which database. Inspect the incoming data in `./sequenceDataReducer.js/` and in the corresponding actions.

### Notes for further Development

Following are a couple of things that should be either investigated or enhanced to ensure the usability of the application.

1. This application was only extensively tested for the Gene *P04637* and the mapped protein *4qo1*. Investigate all (especially long genes) are displayed correctly.
2. To make it easier to use the selection fields, it is crucial to have better input checking and clear error messages.
3. If performance should ever become a problem, the `shouldComponentUpdate` function of React components can be optimised to stop prevent unnecessary component updates. Optimising the data parsers as well as the data structures in the state is also an option.
4. The state object already offers to save the data of multiple selections. This was originally implemented to support a platform behind the client application where it is possible to save and access projects.
5. Reordering lanes is a little tedious. A drag and drop functionality for feature lanes would increase usability.
6. Because this application uses Redux it is possible to revert user interactions that are reflected by the state with the 'back' button in the browser.

### Known Bugs

None.
