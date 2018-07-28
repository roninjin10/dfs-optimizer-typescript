import {NBATeam} from './NBATeam'

export enum FantasyStat {
  projection = 'projection',
  salary = 'salary',
}

export interface Player {
  name: string
  salary: number
  projection: number
  team: NBATeam
}