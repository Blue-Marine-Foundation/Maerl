'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const SetUrlProjects = ({ projects }: { projects: string[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current projects from URL
  const currentProjectsParam = searchParams.get('projects');
  const currentProjects = currentProjectsParam
    ? currentProjectsParam.split('|')
    : [];

  // State for checked projects
  const [checkedProjects, setCheckedProjects] =
    useState<string[]>(currentProjects);

  // Update local state when URL changes
  useEffect(() => {
    const urlProjects = currentProjectsParam
      ? currentProjectsParam.split('|')
      : [];
    setCheckedProjects(urlProjects);
  }, [currentProjectsParam]);

  const handleProjectToggle = (project: string, checked: boolean) => {
    let newCheckedProjects: string[];

    if (checked) {
      // Add project if not already checked
      newCheckedProjects = [...checkedProjects, project];
    } else {
      // Remove project if checked
      newCheckedProjects = checkedProjects.filter((p) => p !== project);
    }

    setCheckedProjects(newCheckedProjects);

    // Update URL
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newCheckedProjects.length === 0) {
      // Remove query string if all unchecked
      newSearchParams.delete('projects');
    } else {
      // Set projects query parameter
      newSearchParams.set('projects', newCheckedProjects.join('|'));
    }

    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    router.replace(newUrl);
  };

  const getButtonText = () => {
    if (checkedProjects.length === 0) {
      return 'Filter projects';
    } else if (checkedProjects.length === projects.length) {
      return 'All projects selected';
    } else {
      return `${checkedProjects.length} project${checkedProjects.length === 1 ? '' : 's'} selected`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-40 rounded-md border-foreground/20 bg-background'
        >
          {getButtonText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Select Projects</h4>
            <p className='text-sm text-muted-foreground'>
              {`${checkedProjects.length} project${
                checkedProjects.length === 1 ? '' : 's'
              } selected`}
            </p>
          </div>
          <div className='space-y-2'>
            {projects.map((project) => (
              <div key={project} className='flex items-center space-x-2'>
                <Checkbox
                  id={project}
                  checked={checkedProjects.includes(project)}
                  onCheckedChange={(checked) =>
                    handleProjectToggle(project, checked as boolean)
                  }
                />
                <Label
                  htmlFor={project}
                  className='cursor-pointer text-sm font-normal'
                >
                  {project}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SetUrlProjects;
