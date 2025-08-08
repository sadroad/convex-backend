use anyhow::Context;
use axum::{
    debug_handler,
    extract::State,
    response::IntoResponse,
};
use common::{
    components::{
        CanonicalizedComponentFunctionPath,
        ComponentId,
        ComponentPath,
    },
    http::{
        extract::Json,
        HttpResponseError,
    },
};
use errors::ErrorMetadata;
use http::StatusCode;
use model::scheduled_jobs::{
    SchedulerModel,
    SCHEDULED_JOBS_TABLE,
};
use serde::{
    Deserialize,
    Serialize,
};
use sync_types::Timestamp;
use value::TableNamespace;

use crate::{
    admin::must_be_admin_with_write_access,
    authentication::ExtractIdentity,
    parse::parse_document_id,
    LocalAppState,
};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CancelAllJobsRequest {
    /// component_id is the current component in which we will cancel all jobs.
    pub component_id: Option<String>,
    /// component_path and udf_path are an optional filter for the function that
    /// is scheduled. component_path need not match component_id, which can
    /// happen if a function is scheduled from a different component.
    pub component_path: Option<String>,
    pub udf_path: Option<String>,

    // Optional inclusive lower bound for the row's `startTs`.
    pub start_next_ts: Option<u64>,
    // Optional exclusive upper bound for the row's `startTs`.
    pub end_next_ts: Option<u64>,
}

#[debug_handler]
pub async fn cancel_all_jobs(
    State(st): State<LocalAppState>,
    ExtractIdentity(identity): ExtractIdentity,
    Json(CancelAllJobsRequest {
        component_id,
        udf_path,
        component_path,
        start_next_ts,
        end_next_ts,
    }): Json<CancelAllJobsRequest>,
) -> Result<impl IntoResponse, HttpResponseError> {
    must_be_admin_with_write_access(&identity)?;

    let udf_path = udf_path
        .map(|p| p.parse())
        .transpose()
        .context(ErrorMetadata::bad_request(
            "InvaildUdfPath",
            "CancelAllJobs requires an optional canonicalized UdfPath",
        ))?;
    let component_id = ComponentId::deserialize_from_string(component_id.as_deref())?;
    let path = match udf_path {
        None => None,
        Some(udf_path) => Some(CanonicalizedComponentFunctionPath {
            component: ComponentPath::deserialize(component_path.as_deref())?,
            udf_path,
        }),
    };
    let start_next_ts =
        start_next_ts
            .map(Timestamp::try_from)
            .transpose()
            .context(ErrorMetadata::bad_request(
                "InvalidStartNextTs",
                "start_next_ts must be a valid timestamp",
            ))?;
    let end_next_ts =
        end_next_ts
            .map(Timestamp::try_from)
            .transpose()
            .context(ErrorMetadata::bad_request(
                "InvalidEndNextTs",
                "end_next_ts must be a valid timestamp",
            ))?;
    st.application
        .cancel_all_jobs(component_id, path, identity, start_next_ts, end_next_ts)
        .await?;

    Ok(StatusCode::OK)
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CancelJobRequest {
    pub id: String,
    pub component_id: Option<String>,
}

#[debug_handler]
pub async fn cancel_job(
    State(st): State<LocalAppState>,
    ExtractIdentity(identity): ExtractIdentity,
    Json(cancel_job_request): Json<CancelJobRequest>,
) -> Result<impl IntoResponse, HttpResponseError> {
    must_be_admin_with_write_access(&identity)?;
    let component_id =
        ComponentId::deserialize_from_string(cancel_job_request.component_id.as_deref())?;
    st.application
        .execute_with_audit_log_events_and_occ_retries(identity.clone(), "cancel_job", |tx| {
            async {
                let namespace = TableNamespace::from(component_id);
                let id = parse_document_id(
                    &cancel_job_request.id,
                    &tx.table_mapping().namespace(namespace),
                    &SCHEDULED_JOBS_TABLE,
                )?;

                let mut model = SchedulerModel::new(tx, namespace);
                model.cancel(id).await?;
                Ok(((), vec![]))
            }
            .into()
        })
        .await?;

    Ok(StatusCode::OK)
}
