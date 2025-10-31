import DOMPurify from 'dompurify';

export class InputValidator {
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img', 'table',
        'thead', 'tbody', 'tr', 'td', 'th',
        'blockquote', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
    });
  }

  static sanitizeText(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = {} as Record<string, any>;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'string') {
          if (key.includes('html') || key.includes('content') || key.includes('description')) {
            sanitized[key] = this.sanitizeHTML(value);
          } else {
            sanitized[key] = this.sanitizeText(value);
          }
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized as T;
  }
}
