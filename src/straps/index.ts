import {larastan} from './larastan';
import {ListrContext, ListrTask} from 'listr';

export interface Strap {
  name: string;
  tasks: ListrTask[];
  skip?: () => Promise<string | false>;
  context?: () => Promise<ListrContext>
}

const straps: Strap[] = [
  larastan,
];

export const findStrap = (name: string): Strap | null => straps.find(strap => strap.name === name) || null;
