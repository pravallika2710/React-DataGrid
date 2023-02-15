
import { useMemo } from "react";


export function useCalculatedColumns3({
  rawColumns,
}) {
 
  const { columns3 } =
    useMemo(() => {
     
    

        const columns3 = rawColumns.map((rawColumn, pos) => {
            //need to be changed
            var recursiveChild = (subChild, rawColumn) => {
              return (
                subChild.haveChildren === true &&
                subChild?.children.map((subChild2, index1) => {
                  const rawChild2 = {
                    ...subChild2,
                    topHeader: rawColumn.field,
                    children: recursiveChild(subChild2, rawColumn),
                  };
                  return rawChild2;
                })
              );
            };
        
        
            const column = {
              ...rawColumn,
              
              topHeader: rawColumn.field,
              children:
                rawColumn.haveChildren === true &&
                rawColumn?.children.map((child, index1) => {
                  
                  const rawChild = {
                    ...child,
                    topHeader: rawColumn.field,
                    children:
                      child.haveChildren === true &&
                      child?.children.map((subChild, index2) => {
                       
                        const rawChild1 = {
                          ...subChild,
                          topHeader: rawColumn.field,
                          children: recursiveChild(subChild, rawColumn),
                        };
                        return rawChild1;
                      }),
                  };
                  return rawChild;
                }),
            };  
        
            return column;
          });
     
         
      return {
        columns3,
       
      };
    }, [
      rawColumns, //need to be changed
    ]);

  

 


  return {
    columns3,
  
  };
}
