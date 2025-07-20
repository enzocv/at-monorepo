export interface BaseState {
    loading: boolean;
    error: string | null;
}

export interface ApiResponse<T> {
    data: T;
    timestamp: string;
} 