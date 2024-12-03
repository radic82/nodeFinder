# nodeFinder
A node application to search text into a file
## Precondition
- Install **Node.js** https://nodejs.org/en/download
- Move into folder *utility-documentation\development\finder\generic*
> npm install properties-reader
>
> npm install graceful-fs
>
> npm install path
>   
> npm install chalk

## Configuration
Modify the file configuration.properties with
- [**search.regexp**] - true/false type of search regepx or simple text
- [**search.path.x**] - configure your path, you should add infinite paths (the default one is 0 position)
- [**search.ext**] - extension of the files to include in file search result, separate extension by |
- [**search.only.in.name**] - type of search if true check only the name of the file and not the content
- [**search.count.row**] - total of lines of files (pay attention that the search could be slow)

## How to use:
Move into folder *utility-documentation\development\finder\generic* 

Open a terminal and launch:
- [default] -  **node finder.js textToSearch**  

example *node finder.js MyClass*
- [custom folder using index path] - **node finder.js textToSearch regexpBoolean indexPath** 

example *node finder.js MyClass true 2*
