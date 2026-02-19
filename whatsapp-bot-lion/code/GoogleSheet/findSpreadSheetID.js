import { MyProjects } from '../DamacHills2List.js';

export async function findSpreadSheetID(ProjectIndex){
    console.log("index", ProjectIndex);

    let Project =  MyProjects.find(Project => Project.ProjectID === ProjectIndex);
    console.log("Project", Project);
    console.log("My Project", MyProjects);
    console.log("Project Name", Project.ProjectName);
    console.log("Project ID", Project.ProjectID);



    return Project
}