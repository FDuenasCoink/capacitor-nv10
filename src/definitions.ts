export interface NV10Plugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
