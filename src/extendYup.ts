import { extendSchema } from '@sodaru/yup-to-json-schema';
import { Schema, addMethod } from 'yup';

extendSchema({ addMethod, Schema });