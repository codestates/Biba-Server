import { Connection } from 'typeorm';
import { Graph } from './graph.entity';

export const graphProviders = [
  {
    provide: 'GRAPH_REPO',
    useFactory: (connection: Connection) => connection.getRepository(Graph),
    inject: ['DATABESE_CONNECTION'],
  },
];
