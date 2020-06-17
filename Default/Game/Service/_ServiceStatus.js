var _ServiceStatus = _ServiceStatus || (function () {
    var _model;
    var _refreshTime = 5000;
    var _disableResizeToFit;
    return {
        Init: function (model, refreshTime, disableResizeToFit = false) {
            _model = model;
            if (refreshTime) {
                _refreshTime = refreshTime * 1000;
            }
            _disableResizeToFit = disableResizeToFit;
            $(document).ready(_ServiceStatus._ready);
        },
        _ready: function () {
            currentplayers = _model.CurrentPlayers;
            slots = _model.Slots;
            var detail = $("#main > .detail");

            var players = $("#PlayersBar");
            var cpu = $("#CPUBar");
            var memory = $("#MemoryBar");
            var bandwidth = $("#BandwidthBar");
            var fdl = $("#FastDownloadBar");

            if (players.length) {
                playerProgress = players.data("kendoProgressBar");
                playerProgress.progressStatus.text("{0}% ({1}/{2})".format(Math.round((currentplayers / slots) * 100), currentplayers, slots));

                if (detail.isChildOverflowing(players) & !_disableResizeToFit) {
                    players.width(detail.width())
                }
            }

            if (cpu.length) {
                if (detail.isChildOverflowing(cpu) & !_disableResizeToFit) {
                    cpu.width(detail.width())
                }
            }

            if (memory.length) {
                memoryProgress = memory.data("kendoProgressBar");
                memoryProgress.progressStatus.text("{0}% ({1})".format(Math.round(_model.CurrentMemoryPercent), getFileSizeFromBytes(_model.CurrentMemory)));

                if (detail.isChildOverflowing(memory) & !_disableResizeToFit) {
                    memory.width(detail.width())
                }
            }

            if (bandwidth.length) {
                bandwidthProgress = bandwidth.data("kendoProgressBar");
                bandwidthProgress.progressStatus.text("{0}/s".format(getFileSizeFromBytes(_model.CurrentBandwidth)));

                if (detail.isChildOverflowing(memory) & !_disableResizeToFit) {
                    bandwidth.width(detail.width())
                }
            }

            if (fdl.length) {
                if (detail.isChildOverflowing(fdl) & !_disableResizeToFit) {
                    fdl.width(detail.width())
                }
                fdlProgress = fdl.data("kendoProgressBar");
                fdlProgress.progressStatus.text("{0}% ({1}/{2})".format(Math.round((_model.FastDownloadUsage / _model.FastDownloadQuota) * 100), getFileSizeFromBytes(_model.FastDownloadUsage), getFileSizeFromBytes(_model.FastDownloadQuota)));
            }

            $("#auto-refresh-switch").kendoSwitch({
                checked: readCookie("TCAdminGameServiceAutoRefresh")=="1",
                onLabel: "ON",
                offLabel: "OFF"
            });

            if ($("#auto-refresh-switch").data("kendoSwitch").check()) {
                window._autoUpdateStopped = false;
                _ServiceStatus.startAutoUpdateCurrentStats(_model.ServiceId);
            }

            $("#auto-refresh-switch").data("kendoSwitch").bind("change", function (e) {
                createCookie("TCAdminGameServiceAutoRefresh", (e.checked) ? "1" : "0");
                if (e.checked) {
                    window._autoUpdateStopped = false;
                    _ServiceStatus.startAutoUpdateCurrentStats(_model.ServiceId);
                }
                else {
                    window._autoUpdateStopped = true;
                    _ServiceStatus.stopAutoUpdateCurrentStats(_model.ServiceId);
                }
            });
        },

        startAutoUpdateCurrentStats: function (serviceId) {
            var cbx = $("#auto-refresh-switch");
            if (!window._autoUpdateStopped && cbx && cbx.val() == "on")
                window._autoUpdateTimeout = setTimeout("_ServiceStatus.getStatus({0})".format(serviceId), _refreshTime);
        },

        stopAutoUpdateCurrentStats: function (serviceId) {
            clearTimeout(window._autoUpdateTimeout);
            window._queryCompleted = true;
        },

        getStatus: function (serviceId) {
            if ($("#BandwidthBar").length || $("#MemoryBar").length || $("#CPUBar").length) {
                $.ajax({
                    type: "POST",
                    url: TCAdmin.Config.get_webAppBase() + "Aspx/Interface/Base/CallBacks/ServiceManager.aspx/GetStatus",
                    data: JSON.stringify({ "serviceId": serviceId }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: _ServiceStatus.getStatusCallBack,
                    error: _ServiceStatus.getStatusCallBack
                });
            } else if ($("#PlayersBar").length) {
                $.ajax({
                    type: "POST",
                    url: TCAdmin.Config.get_webAppBase() + "Aspx/Interface/GameHosting/CallBacks/GameAdmin.aspx/GetQueryWebResult",
                    data: JSON.stringify({ "serviceId": serviceId }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: _ServiceStatus.getQueryStatusCallBack,
                    error: _ServiceStatus.getQueryStatusCallBack
                });
            }
        },

        getStatusCallBack: function (result, status) {
            if (status != "success") {
                //Try again
                _ServiceStatus.startAutoUpdateCurrentStats(_model.ServiceId);
                return;
            }

            result.ServiceId = result.d[0];
            result.StartTime = result.d[1];
            result.Status = result.d[2];
            result.ProcessId = result.d[3];
            result.CpuLastSecond = result.d[4];
            result.MemoryLastSecond = result.d[5];
            result.MemoryPercentageLastSecond = result.d[6];
            result.BandwidthLastSecond = result.d[7];

            if ($("#CPUBar").length) {
                bandwidthProgress = $("#CPUBar").data("kendoProgressBar");
                bandwidthProgress.value(result.CpuLastSecond);
            }

            if ($("#MemoryBar").length) {
                overridemaxmemory =_model.OverrideMaxMemory;

                memoryProgress = $("#MemoryBar").data("kendoProgressBar");
                if (overridemaxmemory > 0) {
                    var tmp = (result.MemoryLastSecond / overridemaxmemory) * 100;
                    result.MemoryPercentageLastSecond = Math.round(tmp * 100) / 100;
                }

                memoryProgress.value(result.MemoryPercentageLastSecond);
                memoryProgress.progressStatus.text("{0}% ({1})".format(Math.round(result.MemoryPercentageLastSecond), getFileSizeFromBytes(result.MemoryLastSecond)));
            }

            if ($("#BandwidthBar").length) {
                bandwidthProgress = $("#BandwidthBar").data("kendoProgressBar");
                bandwidthProgress.progressStatus.text(getFileSizeFromBytes(result.MemoryPercentageLastSecond));
            }

            if ($("#PlayersBar").length) {
                $.ajax({
                    type: "POST",
                    url: TCAdmin.Config.get_webAppBase() + "Aspx/Interface/GameHosting/CallBacks/GameAdmin.aspx/GetQueryWebResult",
                    data: JSON.stringify({ "serviceId": _model.ServiceId }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: _ServiceStatus.getQueryStatusCallBack,
                    error: _ServiceStatus.getQueryStatusCallBack
                });
            }
        },

        getQueryStatusCallBack: function (result, status) {
            if (status != "success") {
                _ServiceStatus.startAutoUpdateCurrentStats(_model.ServiceId);
                return;
            }

            numplayers = result.d.NumPlayers;
            maxplayers = result.d.MaxPlayers;

            percent = 0;
            if (result.d.MaxPlayers > 0) {
                percent = Math.round((numplayers / maxplayers) * 100);
            }


            if ($("#PlayersBar").length) {
                playersProgress = $("#PlayersBar").data("kendoProgressBar");

                playersProgress.value(numplayers);
                playersProgress.progressStatus.text("{0}% ({1}/{2})".format(percent, numplayers, maxplayers));
            }

            _ServiceStatus.startAutoUpdateCurrentStats(_model.ServiceId);
        }
    }
}());