import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const SetUrlProjects = ({ projects }: { projects: string[] }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='rounded-md border-foreground/20 bg-transparent'
        >
          Filter projects
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {projects.map((project) => (
          <div key={project}>{project}</div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default SetUrlProjects;
