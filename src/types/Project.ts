import Location from "./Location"

interface Project {
    id: string,
    projectName: string,
    projectDescription: string,
    projectNumber: string,
    budgetedHours: number,
    locations: Location[]
}

export default Project