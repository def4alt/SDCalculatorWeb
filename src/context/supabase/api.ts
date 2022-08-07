import {
    SupabaseClient,
    createClient,
    PostgrestError,
} from "@supabase/supabase-js";
import { SUPABASE_API_KEY, SUPABASE_PROJECT_URL } from "./constants";
import { ResultAsync } from "neverthrow";

import { definitions } from "src/types/supabase";
import { NotesType, ProcessedData } from "src/types/common";

export const supabase: SupabaseClient = createClient(
    SUPABASE_PROJECT_URL,
    SUPABASE_API_KEY
);

export const getAllLots = (user_id: string) =>
    ResultAsync.fromPromise<number[], PostgrestError>(
        new Promise(
            async (
                resolve: (value: number[]) => void,
                reject: (reason: PostgrestError) => void
            ) => {
                const response = await supabase
                    .from<definitions["backups"]>("backups")
                    .select("lot")
                    .match({ user_id });

                if (response.error) return reject(response.error);

                const lots = response.data.map((t) => t.lot);
                return resolve(lots);
            }
        ),
        (e) => e as PostgrestError
    );

export const deleteRow = (user_id: string, lot: number) =>
    ResultAsync.fromPromise<void, PostgrestError>(
        new Promise(async (resolve, reject) => {
            const response = await supabase
                .from<definitions["backups"]>("backups")
                .delete()
                .match({ user_id, lot });
            if (response.error !== null) reject(response.error);

            resolve();
        }),
        (e: unknown) => e as PostgrestError
    );

export const getFirstMatchedField = <T>(
    user_id: string,
    lot: number,
    field: "data" | "lot" | "notes" | "user_id" | "all"
) =>
    ResultAsync.fromPromise<T, PostgrestError | Error>(
        new Promise(async (resolve, reject) => {
            const response = await supabase
                .from<definitions["backups"]>("backups")
                .select(field === "all" ? "" : field)
                .match({ user_id, lot })
                .limit(1)
                .single();

            if (response.error !== null) {
                reject(response.error);
                return;
            }

            if (field === "all") {
                resolve(response.data as unknown as T);
                return;
            }

            const value = response.data[field] as T;

            if (value === undefined || value === null)
                reject(new Error(`${field} field is empty`));

            resolve(value);
        }),
        (e: unknown) => e as PostgrestError | Error
    );

export const updateField = <T>(
    user_id: string,
    lot: number,
    field: string,
    value: T
) =>
    ResultAsync.fromPromise<void, PostgrestError>(
        new Promise(async (resolve, reject) => {
            const response = await supabase
                .from<definitions["backups"]>("backups")
                .update({ [field]: value })
                .match({ user_id, lot });

            if (response.error !== null) reject(response.error);

            resolve();
        }),
        (e: unknown) => e as PostgrestError
    );

export const insertField = (data: {
    user_id: string;
    lot: number;
    data: ProcessedData[];
    notes?: NotesType;
}) =>
    ResultAsync.fromPromise<void, PostgrestError>(
        new Promise(async (resolve, reject) => {
            const response = await supabase
                .from<definitions["backups"]>("backups")
                .insert(data);

            if (response.error !== null) reject(response.error);

            resolve();
        }),
        (e: unknown) => e as PostgrestError
    );
