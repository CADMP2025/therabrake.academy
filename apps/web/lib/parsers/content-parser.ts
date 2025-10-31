export function parseRichContent(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const modules: any[] = [];
  
  let currentModule: any = null;
  let currentLesson: any = null;
  
  const elements = doc.body.querySelectorAll('*');
  
  elements.forEach(element => {
    // Module detection
    if (element.tagName === 'H1' || 
        element.textContent?.match(/^(Module|Chapter|Section)\s+\d+/i)) {
      if (currentModule) modules.push(currentModule);
      currentModule = {
        title: element.textContent?.replace(/^(Module|Chapter|Section)\s+\d+[:\-\s]*/i, '').trim(),
        lessons: [],
        content: ''
      };
    }
    // Lesson detection
    else if (element.tagName === 'H3' || 
             (element.tagName === 'LI' && currentModule)) {
      currentLesson = {
        title: element.textContent?.trim(),
        content: '',
        duration: 0
      };
      if (currentModule) currentModule.lessons.push(currentLesson);
    }
    // Content accumulation
    else if (element.tagName === 'P' || element.tagName === 'UL') {
      const content = element.innerHTML;
      if (currentLesson) {
        currentLesson.content += content;
      } else if (currentModule) {
        currentModule.content += content;
      }
    }
  });
  
  if (currentModule) modules.push(currentModule);
  return modules;
}
