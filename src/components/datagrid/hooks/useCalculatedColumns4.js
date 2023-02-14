
import { useMemo } from "react";


export function useCalculatedColumns4({
  rowCol2,
}) {
 
  const { columns4 } =
    useMemo(() => {
     


        var columns4 = rowCol2.map((rawColumn, pos) => {
            //need to be changed
          
        
        
            const column = {
              ...rawColumn,
              width:rawColumn.width??"auto"
            };  
            
                column.idx=pos
                
             
        
            return column;
          });
     
         
      return {
        columns4,
       
      };
    }, [
      rowCol2, //need to be changed
    ]);

  

 


  return {
    columns4,
  
  };
}
