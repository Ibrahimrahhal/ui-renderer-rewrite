export interface Renderer {
  render(templatePath: string, data: Object): string;
}
