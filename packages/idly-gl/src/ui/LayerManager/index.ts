import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { Box } from '../helpers';

export function LayerManager(glLayers: any[]): TemplateResult {
  const children = '';
  console.log(glLayers);
  return Box({ title: 'LayerManager', children });
}
