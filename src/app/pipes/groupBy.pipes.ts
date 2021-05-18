import { Pipe,PipeTransform } from '@angular/core';
//import { Array } ;
@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
    transform(collection: Array<any>, property: string): Array<any> {
        // prevents the application from breaking if the array of objects doesn't exist yet
        if(!collection) {
            return null;
        }

        const groupedCollection = collection.reduce((previous, current)=> {
            console.log("GROUP K 1",previous);
            console.log("GROUP K 2",current);
            if(!previous[current[property]]) {
                previous[current[property]] = [current];
            } else {
                previous[current[property]].push(current);
            }

            return previous;
        }, {});
        console.log("GROUP K",groupedCollection);
        // this will return an array of objects, each object containing a group of objects
        return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
    }
}