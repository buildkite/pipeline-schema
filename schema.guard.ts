/*
 * Generated type guards for "schema.ts".
 * WARNING: Do not manually change this file.
 */
import { AgentsList, BuildNotify, Fields, StringBlockStep, StringInputStep, StringWaitStep, Pipeline, Env, AgentsObject, BlockStep, NestedBlockStep, InputStep, NestedInputStep, CommandStep, AutomaticRetry, NestedCommandStep, WaitStep, NestedWaitStep, WaitStep1, TriggerStep, NestedTriggerStep, GroupStep } from "./schema";

export function isAgentsList(obj: unknown): obj is AgentsList {
    const typedObj = obj as AgentsList
    return (
        Array.isArray(typedObj) &&
        typedObj.every((e: any) =>
            typeof e === "string"
        )
    )
}

export function isBuildNotify(obj: unknown): obj is BuildNotify {
    const typedObj = obj as BuildNotify
    return (
        Array.isArray(typedObj) &&
        typedObj.every((e: any) =>
        (e === "github_check" ||
            e === "github_commit_status" ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["email"] === "undefined" ||
                typeof e["email"] === "string") &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["basecamp_campfire"] === "undefined" ||
                typeof e["basecamp_campfire"] === "string") &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["slack"] === "undefined" ||
                typeof e["slack"] === "string" ||
                (e["slack"] !== null &&
                    typeof e["slack"] === "object" ||
                    typeof e["slack"] === "function") &&
                (typeof e["slack"]["channels"] === "undefined" ||
                    Array.isArray(e["slack"]["channels"]) &&
                    e["slack"]["channels"].every((e: any) =>
                        typeof e === "string"
                    )) &&
                (typeof e["slack"]["message"] === "undefined" ||
                    typeof e["slack"]["message"] === "string") &&
                Object.entries<any>(e["slack"])
                    .filter(([key]) => !["channels", "message"].includes(key))
                    .every(([key, _value]) => (typeof key === "string"))) &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["webhook"] === "undefined" ||
                typeof e["webhook"] === "string") &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["pagerduty_change_event"] === "undefined" ||
                typeof e["pagerduty_change_event"] === "string") &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["github_commit_status"] === "undefined" ||
                (e["github_commit_status"] !== null &&
                    typeof e["github_commit_status"] === "object" ||
                    typeof e["github_commit_status"] === "function") &&
                (typeof e["github_commit_status"]["context"] === "undefined" ||
                    typeof e["github_commit_status"]["context"] === "string") &&
                Object.entries<any>(e["github_commit_status"])
                    .filter(([key]) => !["context"].includes(key))
                    .every(([key, _value]) => (typeof key === "string"))) &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["github_check"] === "undefined" ||
                (e["github_check"] !== null &&
                    typeof e["github_check"] === "object" ||
                    typeof e["github_check"] === "function") &&
                (typeof e["github_check"]["context"] === "undefined" ||
                    typeof e["github_check"]["context"] === "string") &&
                Object.entries<any>(e["github_check"])
                    .filter(([key]) => !["context"].includes(key))
                    .every(([key, _value]) => (typeof key === "string"))) &&
            (typeof e["if"] === "undefined" ||
                typeof e["if"] === "string"))
        )
    )
}

export function isFields(obj: unknown): obj is Fields {
    const typedObj = obj as Fields
    return (
        Array.isArray(typedObj) &&
        typedObj.every((e: any) =>
        ((e !== null &&
            typeof e === "object" ||
            typeof e === "function") &&
            (typeof e["text"] === "undefined" ||
                typeof e["text"] === "string") &&
            typeof e["key"] === "string" &&
            (typeof e["hint"] === "undefined" ||
                typeof e["hint"] === "string") &&
            (typeof e["required"] === "undefined" ||
                e["required"] === false ||
                e["required"] === true) &&
            (typeof e["default"] === "undefined" ||
                typeof e["default"] === "string") ||
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            (typeof e["select"] === "undefined" ||
                typeof e["select"] === "string") &&
            typeof e["key"] === "string" &&
            (typeof e["default"] === "undefined" ||
                typeof e["default"] === "string" ||
                Array.isArray(e["default"]) &&
                e["default"].every((e: any) =>
                    typeof e === "string"
                )) &&
            (typeof e["hint"] === "undefined" ||
                typeof e["hint"] === "string") &&
            (typeof e["multiple"] === "undefined" ||
                e["multiple"] === false ||
                e["multiple"] === true) &&
            Array.isArray(e["options"]) &&
            e["options"].every((e: any) =>
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                typeof e["label"] === "string" &&
                typeof e["value"] === "string" &&
                (typeof e["hint"] === "undefined" ||
                    typeof e["hint"] === "string") &&
                (typeof e["required"] === "undefined" ||
                    e["required"] === false ||
                    e["required"] === true)
            ) &&
            (typeof e["required"] === "undefined" ||
                e["required"] === false ||
                e["required"] === true))
        )
    )
}

export function isStringBlockStep(obj: unknown): obj is StringBlockStep {
    const typedObj = obj as StringBlockStep
    return (
        typedObj === "block"
    )
}

export function isStringInputStep(obj: unknown): obj is StringInputStep {
    const typedObj = obj as StringInputStep
    return (
        typedObj === "input"
    )
}

export function isStringWaitStep(obj: unknown): obj is StringWaitStep {
    const typedObj = obj as StringWaitStep
    return (
        (typedObj === "wait" ||
            typedObj === "waiter")
    )
}

export function isPipeline(obj: unknown): obj is Pipeline {
    const typedObj = obj as Pipeline
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["env"] === "undefined" ||
            isEnv(typedObj["env"]) as boolean) &&
        (typeof typedObj["agents"] === "undefined" ||
            isAgentsList(typedObj["agents"]) as boolean ||
            isAgentsObject(typedObj["agents"]) as boolean) &&
        (typeof typedObj["notify"] === "undefined" ||
            isBuildNotify(typedObj["notify"]) as boolean) &&
        (typeof typedObj["steps"] === "undefined" ||
            Array.isArray(typedObj["steps"]) &&
            typedObj["steps"].every((e: any) =>
            (isStringBlockStep(e) as boolean ||
                isStringInputStep(e) as boolean ||
                e === "wait" ||
                e === "waiter" ||
                isBlockStep(e) as boolean ||
                isNestedBlockStep(e) as boolean ||
                isInputStep(e) as boolean ||
                isNestedInputStep(e) as boolean ||
                isCommandStep(e) as boolean ||
                isNestedCommandStep(e) as boolean ||
                isWaitStep(e) as boolean ||
                isNestedWaitStep(e) as boolean ||
                isTriggerStep(e) as boolean ||
                isNestedTriggerStep(e) as boolean ||
                isGroupStep(e) as boolean)
            )) &&
        Object.entries<any>(typedObj)
            .filter(([key]) => !["env", "agents", "notify", "steps"].includes(key))
            .every(([key, _value]) => (typeof key === "string"))
    )
}

export function isEnv(obj: unknown): obj is Env {
    const typedObj = obj as Env
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        Object.entries<any>(typedObj)
            .every(([key, _value]) => (typeof key === "string"))
    )
}

export function isAgentsObject(obj: unknown): obj is AgentsObject {
    const typedObj = obj as AgentsObject
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        Object.entries<any>(typedObj)
            .every(([key, _value]) => (typeof key === "string"))
    )
}

export function isBlockStep(obj: unknown): obj is BlockStep {
    const typedObj = obj as BlockStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["allow_dependency_failure"] === "undefined" ||
            typedObj["allow_dependency_failure"] === false ||
            typedObj["allow_dependency_failure"] === true) &&
        (typeof typedObj["block"] === "undefined" ||
            typeof typedObj["block"] === "string") &&
        (typeof typedObj["blocked_state"] === "undefined" ||
            typedObj["blocked_state"] === "passed" ||
            typedObj["blocked_state"] === "failed" ||
            typedObj["blocked_state"] === "running") &&
        (typeof typedObj["branches"] === "undefined" ||
            typeof typedObj["branches"] === "string" ||
            Array.isArray(typedObj["branches"]) &&
            typedObj["branches"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["fields"] === "undefined" ||
            isFields(typedObj["fields"]) as boolean) &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["if"] === "undefined" ||
            typeof typedObj["if"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["label"] === "undefined" ||
            typeof typedObj["label"] === "string") &&
        (typeof typedObj["name"] === "undefined" ||
            typeof typedObj["name"] === "string") &&
        (typeof typedObj["prompt"] === "undefined" ||
            typeof typedObj["prompt"] === "string") &&
        (typeof typedObj["type"] === "undefined" ||
            isStringBlockStep(typedObj["type"]) as boolean)
    )
}

export function isNestedBlockStep(obj: unknown): obj is NestedBlockStep {
    const typedObj = obj as NestedBlockStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["block"] === "undefined" ||
            isBlockStep(typedObj["block"]) as boolean)
    )
}

export function isInputStep(obj: unknown): obj is InputStep {
    const typedObj = obj as InputStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["allow_dependency_failure"] === "undefined" ||
            typedObj["allow_dependency_failure"] === false ||
            typedObj["allow_dependency_failure"] === true) &&
        (typeof typedObj["input"] === "undefined" ||
            typeof typedObj["input"] === "string") &&
        (typeof typedObj["branches"] === "undefined" ||
            typeof typedObj["branches"] === "string" ||
            Array.isArray(typedObj["branches"]) &&
            typedObj["branches"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["fields"] === "undefined" ||
            isFields(typedObj["fields"]) as boolean) &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["if"] === "undefined" ||
            typeof typedObj["if"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["label"] === "undefined" ||
            typeof typedObj["label"] === "string") &&
        (typeof typedObj["name"] === "undefined" ||
            typeof typedObj["name"] === "string") &&
        (typeof typedObj["prompt"] === "undefined" ||
            typeof typedObj["prompt"] === "string") &&
        (typeof typedObj["type"] === "undefined" ||
            isStringInputStep(typedObj["type"]) as boolean)
    )
}

export function isNestedInputStep(obj: unknown): obj is NestedInputStep {
    const typedObj = obj as NestedInputStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["input"] === "undefined" ||
            isInputStep(typedObj["input"]) as boolean)
    )
}

export function isCommandStep(obj: unknown): obj is CommandStep {
    const typedObj = obj as CommandStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["agents"] === "undefined" ||
            isAgentsList(typedObj["agents"]) as boolean ||
            isAgentsObject(typedObj["agents"]) as boolean) &&
        (typeof typedObj["allow_dependency_failure"] === "undefined" ||
            typedObj["allow_dependency_failure"] === false ||
            typedObj["allow_dependency_failure"] === true) &&
        (typeof typedObj["artifact_paths"] === "undefined" ||
            typeof typedObj["artifact_paths"] === "string" ||
            Array.isArray(typedObj["artifact_paths"]) &&
            typedObj["artifact_paths"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["branches"] === "undefined" ||
            typeof typedObj["branches"] === "string" ||
            Array.isArray(typedObj["branches"]) &&
            typedObj["branches"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["command"] === "undefined" ||
            typeof typedObj["command"] === "string" ||
            Array.isArray(typedObj["command"]) &&
            typedObj["command"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["commands"] === "undefined" ||
            typeof typedObj["commands"] === "string" ||
            Array.isArray(typedObj["commands"]) &&
            typedObj["commands"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["concurrency"] === "undefined" ||
            typeof typedObj["concurrency"] === "number") &&
        (typeof typedObj["concurrency_group"] === "undefined" ||
            typeof typedObj["concurrency_group"] === "string") &&
        (typeof typedObj["concurrency_method"] === "undefined" ||
            typedObj["concurrency_method"] === "ordered" ||
            typedObj["concurrency_method"] === "eager") &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["env"] === "undefined" ||
            isEnv(typedObj["env"]) as boolean) &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["if"] === "undefined" ||
            typeof typedObj["if"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["label"] === "undefined" ||
            typeof typedObj["label"] === "string") &&
        (typeof typedObj["matrix"] === "undefined" ||
            Array.isArray(typedObj["matrix"]) &&
            typedObj["matrix"].every((e: any) =>
            (typeof e === "string" ||
                typeof e === "number" ||
                e === false ||
                e === true)
            ) ||
            (typedObj["matrix"] !== null &&
                typeof typedObj["matrix"] === "object" ||
                typeof typedObj["matrix"] === "function") &&
            (Array.isArray(typedObj["matrix"]["setup"]) &&
                typedObj["matrix"]["setup"].every((e: any) =>
                (typeof e === "string" ||
                    typeof e === "number" ||
                    e === false ||
                    e === true)
                ) ||
                (typedObj["matrix"]["setup"] !== null &&
                    typeof typedObj["matrix"]["setup"] === "object" ||
                    typeof typedObj["matrix"]["setup"] === "function") &&
                Object.entries<any>(typedObj["matrix"]["setup"])
                    .every(([key, value]) => (Array.isArray(value) &&
                        value.every((e: any) =>
                        (typeof e === "string" ||
                            typeof e === "number" ||
                            e === false ||
                            e === true)
                        ) &&
                        typeof key === "string"))) &&
            (typeof typedObj["matrix"]["adjustments"] === "undefined" ||
                Array.isArray(typedObj["matrix"]["adjustments"]) &&
                typedObj["matrix"]["adjustments"].every((e: any) =>
                    (e !== null &&
                        typeof e === "object" ||
                        typeof e === "function") &&
                    (Array.isArray(e["with"]) &&
                        e["with"].every((e: any) =>
                        (typeof e === "string" ||
                            typeof e === "number" ||
                            e === false ||
                            e === true)
                        ) ||
                        (e["with"] !== null &&
                            typeof e["with"] === "object" ||
                            typeof e["with"] === "function") &&
                        Object.entries<any>(e["with"])
                            .every(([key, value]) => (typeof value === "string" &&
                                typeof key === "string"))) &&
                    (typeof e["skip"] === "undefined" ||
                        typeof e["skip"] === "string" ||
                        e["skip"] === false ||
                        e["skip"] === true) &&
                    (typeof e["soft_fail"] === "undefined" ||
                        e["soft_fail"] === false ||
                        e["soft_fail"] === true ||
                        Array.isArray(e["soft_fail"]) &&
                        e["soft_fail"].every((e: any) =>
                            (e !== null &&
                                typeof e === "object" ||
                                typeof e === "function") &&
                            (typeof e["exit_status"] === "undefined" ||
                                typeof e["exit_status"] === "number" ||
                                e["exit_status"] === "*") &&
                            Object.entries<any>(e)
                                .filter(([key]) => !["exit_status"].includes(key))
                                .every(([key, _value]) => (typeof key === "string"))
                        )) &&
                    Object.entries<any>(e)
                        .filter(([key]) => !["with", "skip", "soft_fail"].includes(key))
                        .every(([key, _value]) => (typeof key === "string"))
                )) &&
            Object.entries<any>(typedObj["matrix"])
                .filter(([key]) => !["setup", "adjustments"].includes(key))
                .every(([key, _value]) => (typeof key === "string"))) &&
        (typeof typedObj["name"] === "undefined" ||
            typeof typedObj["name"] === "string") &&
        (typeof typedObj["notify"] === "undefined" ||
            Array.isArray(typedObj["notify"]) &&
            typedObj["notify"].every((e: any) =>
            (e === "github_check" ||
                e === "github_commit_status" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["basecamp_campfire"] === "undefined" ||
                    typeof e["basecamp_campfire"] === "string") &&
                (typeof e["if"] === "undefined" ||
                    typeof e["if"] === "string") ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["slack"] === "undefined" ||
                    typeof e["slack"] === "string" ||
                    (e["slack"] !== null &&
                        typeof e["slack"] === "object" ||
                        typeof e["slack"] === "function") &&
                    (typeof e["slack"]["channels"] === "undefined" ||
                        Array.isArray(e["slack"]["channels"]) &&
                        e["slack"]["channels"].every((e: any) =>
                            typeof e === "string"
                        )) &&
                    (typeof e["slack"]["message"] === "undefined" ||
                        typeof e["slack"]["message"] === "string") &&
                    Object.entries<any>(e["slack"])
                        .filter(([key]) => !["channels", "message"].includes(key))
                        .every(([key, _value]) => (typeof key === "string"))) &&
                (typeof e["if"] === "undefined" ||
                    typeof e["if"] === "string") ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["github_commit_status"] === "undefined" ||
                    (e["github_commit_status"] !== null &&
                        typeof e["github_commit_status"] === "object" ||
                        typeof e["github_commit_status"] === "function") &&
                    (typeof e["github_commit_status"]["context"] === "undefined" ||
                        typeof e["github_commit_status"]["context"] === "string") &&
                    Object.entries<any>(e["github_commit_status"])
                        .filter(([key]) => !["context"].includes(key))
                        .every(([key, _value]) => (typeof key === "string"))) &&
                (typeof e["if"] === "undefined" ||
                    typeof e["if"] === "string") ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["github_check"] === "undefined" ||
                    (e["github_check"] !== null &&
                        typeof e["github_check"] === "object" ||
                        typeof e["github_check"] === "function") &&
                    (typeof e["github_check"]["context"] === "undefined" ||
                        typeof e["github_check"]["context"] === "string") &&
                    Object.entries<any>(e["github_check"])
                        .filter(([key]) => !["context"].includes(key))
                        .every(([key, _value]) => (typeof key === "string"))) &&
                (typeof e["if"] === "undefined" ||
                    typeof e["if"] === "string"))
            )) &&
        (typeof typedObj["parallelism"] === "undefined" ||
            typeof typedObj["parallelism"] === "number") &&
        (typeof typedObj["plugins"] === "undefined" ||
            Array.isArray(typedObj["plugins"]) &&
            typedObj["plugins"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                Object.entries<any>(e)
                    .every(([key, _value]) => (typeof key === "string")))
            ) ||
            (typedObj["plugins"] !== null &&
                typeof typedObj["plugins"] === "object" ||
                typeof typedObj["plugins"] === "function") &&
            Object.entries<any>(typedObj["plugins"])
                .every(([key, _value]) => (typeof key === "string"))) &&
        (typeof typedObj["soft_fail"] === "undefined" ||
            typedObj["soft_fail"] === false ||
            typedObj["soft_fail"] === true ||
            Array.isArray(typedObj["soft_fail"]) &&
            typedObj["soft_fail"].every((e: any) =>
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["exit_status"] === "undefined" ||
                    typeof e["exit_status"] === "number" ||
                    e["exit_status"] === "*") &&
                Object.entries<any>(e)
                    .filter(([key]) => !["exit_status"].includes(key))
                    .every(([key, _value]) => (typeof key === "string"))
            )) &&
        (typeof typedObj["retry"] === "undefined" ||
            (typedObj["retry"] !== null &&
                typeof typedObj["retry"] === "object" ||
                typeof typedObj["retry"] === "function") &&
            (typeof typedObj["retry"]["automatic"] === "undefined" ||
                typedObj["retry"]["automatic"] === false ||
                typedObj["retry"]["automatic"] === true ||
                isAutomaticRetry(typedObj["retry"]["automatic"]) as boolean ||
                Array.isArray(typedObj["retry"]["automatic"]) &&
                typedObj["retry"]["automatic"].every((e: any) =>
                    isAutomaticRetry(e) as boolean
                )) &&
            (typeof typedObj["retry"]["manual"] === "undefined" ||
                typedObj["retry"]["manual"] === false ||
                typedObj["retry"]["manual"] === true ||
                (typedObj["retry"]["manual"] !== null &&
                    typeof typedObj["retry"]["manual"] === "object" ||
                    typeof typedObj["retry"]["manual"] === "function") &&
                (typeof typedObj["retry"]["manual"]["allowed"] === "undefined" ||
                    typedObj["retry"]["manual"]["allowed"] === false ||
                    typedObj["retry"]["manual"]["allowed"] === true) &&
                (typeof typedObj["retry"]["manual"]["permit_on_passed"] === "undefined" ||
                    typedObj["retry"]["manual"]["permit_on_passed"] === false ||
                    typedObj["retry"]["manual"]["permit_on_passed"] === true) &&
                (typeof typedObj["retry"]["manual"]["reason"] === "undefined" ||
                    typeof typedObj["retry"]["manual"]["reason"] === "string")) &&
            Object.entries<any>(typedObj["retry"])
                .filter(([key]) => !["automatic", "manual"].includes(key))
                .every(([key, _value]) => (typeof key === "string"))) &&
        (typeof typedObj["skip"] === "undefined" ||
            typeof typedObj["skip"] === "string" ||
            typedObj["skip"] === false ||
            typedObj["skip"] === true) &&
        (typeof typedObj["timeout_in_minutes"] === "undefined" ||
            typeof typedObj["timeout_in_minutes"] === "number") &&
        (typeof typedObj["type"] === "undefined" ||
            typedObj["type"] === "script" ||
            typedObj["type"] === "command" ||
            typedObj["type"] === "commands") &&
        (typeof typedObj["priority"] === "undefined" ||
            typeof typedObj["priority"] === "number")
    )
}

export function isAutomaticRetry(obj: unknown): obj is AutomaticRetry {
    const typedObj = obj as AutomaticRetry
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["exit_status"] === "undefined" ||
            typeof typedObj["exit_status"] === "number" ||
            typedObj["exit_status"] === "*") &&
        (typeof typedObj["limit"] === "undefined" ||
            typeof typedObj["limit"] === "number")
    )
}

export function isNestedCommandStep(obj: unknown): obj is NestedCommandStep {
    const typedObj = obj as NestedCommandStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["command"] === "undefined" ||
            isCommandStep(typedObj["command"]) as boolean) &&
        (typeof typedObj["commands"] === "undefined" ||
            isCommandStep(typedObj["commands"]) as boolean) &&
        (typeof typedObj["script"] === "undefined" ||
            isCommandStep(typedObj["script"]) as boolean)
    )
}

export function isWaitStep(obj: unknown): obj is WaitStep {
    const typedObj = obj as WaitStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["allow_dependency_failure"] === "undefined" ||
            typedObj["allow_dependency_failure"] === false ||
            typedObj["allow_dependency_failure"] === true) &&
        (typeof typedObj["continue_on_failure"] === "undefined" ||
            typedObj["continue_on_failure"] === false ||
            typedObj["continue_on_failure"] === true) &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["if"] === "undefined" ||
            typeof typedObj["if"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["type"] === "undefined" ||
            typedObj["type"] === "wait" ||
            typedObj["type"] === "waiter") &&
        (typeof typedObj["wait"] === "undefined" ||
            typedObj["wait"] === null ||
            typedObj["wait"] === "") &&
        (typeof typedObj["waiter"] === "undefined" ||
            typedObj["waiter"] === null ||
            typedObj["waiter"] === "")
    )
}

export function isNestedWaitStep(obj: unknown): obj is NestedWaitStep {
    const typedObj = obj as NestedWaitStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["wait"] === "undefined" ||
            isWaitStep1(typedObj["wait"]) as boolean) &&
        (typeof typedObj["waiter"] === "undefined" ||
            isWaitStep(typedObj["waiter"]) as boolean)
    )
}

export function isWaitStep1(obj: unknown): obj is WaitStep1 {
    const typedObj = obj as WaitStep1
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["allow_dependency_failure"] === "undefined" ||
            typedObj["allow_dependency_failure"] === false ||
            typedObj["allow_dependency_failure"] === true) &&
        (typeof typedObj["continue_on_failure"] === "undefined" ||
            typedObj["continue_on_failure"] === false ||
            typedObj["continue_on_failure"] === true) &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["if"] === "undefined" ||
            typeof typedObj["if"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["type"] === "undefined" ||
            typedObj["type"] === "wait" ||
            typedObj["type"] === "waiter") &&
        (typeof typedObj["wait"] === "undefined" ||
            typedObj["wait"] === null ||
            typedObj["wait"] === "") &&
        (typeof typedObj["waiter"] === "undefined" ||
            typedObj["waiter"] === null ||
            typedObj["waiter"] === "")
    )
}

export function isTriggerStep(obj: unknown): obj is TriggerStep {
    const typedObj = obj as TriggerStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["allow_dependency_failure"] === "undefined" ||
            typedObj["allow_dependency_failure"] === false ||
            typedObj["allow_dependency_failure"] === true) &&
        (typeof typedObj["async"] === "undefined" ||
            typedObj["async"] === false ||
            typedObj["async"] === true) &&
        (typeof typedObj["branches"] === "undefined" ||
            typeof typedObj["branches"] === "string" ||
            Array.isArray(typedObj["branches"]) &&
            typedObj["branches"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["build"] === "undefined" ||
            (typedObj["build"] !== null &&
                typeof typedObj["build"] === "object" ||
                typeof typedObj["build"] === "function") &&
            (typeof typedObj["build"]["branch"] === "undefined" ||
                typeof typedObj["build"]["branch"] === "string") &&
            (typeof typedObj["build"]["commit"] === "undefined" ||
                typeof typedObj["build"]["commit"] === "string") &&
            (typeof typedObj["build"]["env"] === "undefined" ||
                isEnv(typedObj["build"]["env"]) as boolean) &&
            (typeof typedObj["build"]["label"] === "undefined" ||
                typeof typedObj["build"]["label"] === "string") &&
            (typeof typedObj["build"]["name"] === "undefined" ||
                typeof typedObj["build"]["name"] === "string") &&
            (typeof typedObj["build"]["message"] === "undefined" ||
                typeof typedObj["build"]["message"] === "string") &&
            (typeof typedObj["build"]["meta_data"] === "undefined" ||
                (typedObj["build"]["meta_data"] !== null &&
                    typeof typedObj["build"]["meta_data"] === "object" ||
                    typeof typedObj["build"]["meta_data"] === "function") &&
                Object.entries<any>(typedObj["build"]["meta_data"])
                    .every(([key, _value]) => (typeof key === "string"))) &&
            (typeof typedObj["build"]["trigger"] === "undefined" ||
                typeof typedObj["build"]["trigger"] === "string") &&
            (typeof typedObj["build"]["type"] === "undefined" ||
                typedObj["build"]["type"] === "trigger")) &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["if"] === "undefined" ||
            typeof typedObj["if"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["label"] === "undefined" ||
            typeof typedObj["label"] === "string") &&
        (typeof typedObj["name"] === "undefined" ||
            typeof typedObj["name"] === "string") &&
        (typeof typedObj["type"] === "undefined" ||
            typedObj["type"] === "trigger") &&
        (typeof typedObj["trigger"] === "undefined" ||
            typeof typedObj["trigger"] === "string") &&
        (typeof typedObj["skip"] === "undefined" ||
            typeof typedObj["skip"] === "string" ||
            typedObj["skip"] === false ||
            typedObj["skip"] === true)
    )
}

export function isNestedTriggerStep(obj: unknown): obj is NestedTriggerStep {
    const typedObj = obj as NestedTriggerStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["trigger"] === "undefined" ||
            isTriggerStep(typedObj["trigger"]) as boolean)
    )
}

export function isGroupStep(obj: unknown): obj is GroupStep {
    const typedObj = obj as GroupStep
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["depends_on"] === "undefined" ||
            typedObj["depends_on"] === null ||
            typeof typedObj["depends_on"] === "string" ||
            Array.isArray(typedObj["depends_on"]) &&
            typedObj["depends_on"].every((e: any) =>
            (typeof e === "string" ||
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                (typeof e["step"] === "undefined" ||
                    typeof e["step"] === "string") &&
                (typeof e["allow_failure"] === "undefined" ||
                    e["allow_failure"] === false ||
                    e["allow_failure"] === true))
            )) &&
        (typeof typedObj["group"] === "undefined" ||
            typeof typedObj["group"] === "string") &&
        (typeof typedObj["id"] === "undefined" ||
            typeof typedObj["id"] === "string") &&
        (typeof typedObj["identifier"] === "undefined" ||
            typeof typedObj["identifier"] === "string") &&
        (typeof typedObj["key"] === "undefined" ||
            typeof typedObj["key"] === "string") &&
        (typeof typedObj["label"] === "undefined" ||
            typeof typedObj["label"] === "string") &&
        (typeof typedObj["name"] === "undefined" ||
            typeof typedObj["name"] === "string") &&
        (typeof typedObj["steps"] === "undefined" ||
            Array.isArray(typedObj["steps"]) &&
            typedObj["steps"].every((e: any) =>
            (isStringBlockStep(e) as boolean ||
                e === "wait" ||
                e === "waiter" ||
                isBlockStep(e) as boolean ||
                isCommandStep(e) as boolean ||
                isNestedCommandStep(e) as boolean ||
                isWaitStep(e) as boolean ||
                isNestedWaitStep(e) as boolean ||
                isTriggerStep(e) as boolean ||
                isNestedTriggerStep(e) as boolean)
            )) &&
        (typeof typedObj["type"] === "undefined" ||
            typedObj["type"] === "group")
    )
}
